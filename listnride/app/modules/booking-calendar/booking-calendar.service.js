import { get, uniqueId } from 'lodash';
import { DateHelper } from '../../../js_modules/bryntum-scheduler/scheduler.module.min';

angular
  .module('listnride')
  .factory('bookingCalendarService', function(
    $localStorage,
    $translate,
    $mdMedia,
    bikeOptions,
    api,
    MESSAGE_STATUSES
  ) {
    const ALLOWED_REQUEST_STATUSES = [
      MESSAGE_STATUSES.REQUESTED,
      MESSAGE_STATUSES.ACCEPTED,
      MESSAGE_STATUSES.CONFIRMED,
      MESSAGE_STATUSES.ONE_SIDE_RATE,
      MESSAGE_STATUSES.BOTH_SIDES_RATE,
      MESSAGE_STATUSES.RATE_RIDE,
      MESSAGE_STATUSES.COMPLETE
    ];

    return {
      shouldEnableBookingCalendar() {
        return $mdMedia('min-width: 960px');
      },
      getTranslationsForScheduler() {
        return $translate([
          // bikes column
          'shared.id',
          'booking.overview.size',
          'search.unisize',
          'shared.label_new',
          'booking-calendar.bike-variants',
          'booking-calendar.no-bikes-to-display',
          // events
          'booking-calendar.event.accepted',
          'booking-calendar.event.request-waiting',
          'booking-calendar.event.not-available',
          'shared.request',
          'shared.requests',
          // event popups
          'booking-calendar.event.waiting',
          'booking-calendar.event.not-available-header',
          'booking-calendar.event.not-available-text',
          'booking-calendar.event.see-settings',
          'booking-calendar.event.date',
          'booking-calendar.event.pickup',
          'booking.calendar.return-time',
          'booking-calendar.event.booking-id',
          'booking-calendar.event.rider',
          'booking-calendar.event.contact',
          'message.reject',
          'message.accept',
          'booking-calendar.event.view-booking',
          ...bikeOptions.categoriesTranslationKeys()
        ]);
      },

      getRides() {
        return api
          .get(`/users/${$localStorage.userId}/rides?detailed=true`)
          .then(({ data }) => data.bikes)
          .then(bikes => parseBikes(bikes));
      }
    };

    function parseBikes(bikes) {
      bikes = bikes.filter((bike) => bike.available);
      return bikes.reduce(
        (acc, bike) => {
          // clusters don't have their own unique ids
          const bikeId = bike.is_cluster ? `${bike.id}-cluster` : bike.id;

          // bike boilerplate
          const bikeResource = getResource({
            id: bikeId,
            name: `${bike.brand} ${bike.name}`,
            location: bike.location,
            isCluster: bike.is_cluster,
            category: bike.category,
            imageUrl: bike.image_file,
            size: bike.size,
            humanizeSize: bike.frame_size ? bike.frame_size : bikeOptions.getHumanReadableSize(bike.size),
          });

          const bikeRequests = parseRequests({
            id: bikeResource.id,
            requests: bike.requests
          });
          bikeResource.requestsWithNewMessages = parseRequestsWithMewMessages({
            requests: bikeRequests
          });

          // add bike events
          acc.events.push(
            // accepted/pending events
            ...bikeRequests,
            // not available events
            ...parseAvailabilities({
              id: bikeResource.id,
              availabilities: Object.values(get(bike, 'availabilities', {}))
            })
          );

          // add bike
          acc.bikes.push(bikeResource);

          if (bikeResource.isCluster) {
            const allVariantsRequests = [];

            // add bike variants
            bike.rides.forEach((bikeVariant, index) => {
              // add variant requests
              const variantRequests = parseRequests({
                id: bikeVariant.id,
                requests: bikeVariant.requests
              });
              allVariantsRequests.push(...variantRequests);

              // add variant bike
              bikeResource.children.push(
                Object.assign({}, bikeResource, {
                  children: [],
                  requestsWithNewMessages: parseRequestsWithMewMessages({
                    requests: variantRequests
                  }),
                  id: bikeVariant.id,
                  size: bikeVariant.size,
                  humanizeSize: bikeVariant.frame_size ? bikeVariant.frame_size : bikeOptions.getHumanReadableSize(bikeVariant.size),
                  isCluster: false,
                  isVariant: true,
                  variantIndex: index + 1,
                  cls: 'variant-row'
                })
              );
            });

            bikeResource.requestsWithNewMessages = parseRequestsWithMewMessages(
              {
                requests: allVariantsRequests
              }
            );

            // add variant events
            acc.events.push(...allVariantsRequests);

            // add cluster bike requests
            acc.events.push(
              ...parseClusterRequests({
                id: bikeResource.id,
                requests: allVariantsRequests
              })
            );
          }

          // accumulate bike locations
          acc.locations.add(bike.location.en_city);

          return acc;
        },
        { bikes: [], events: [], locations: new Set() }
      );
    }

    function parseRequests({ id, requests }) {
      return requests.reduce((acc, rawRequest) => {
        if (!ALLOWED_REQUEST_STATUSES.includes(rawRequest.status)) {
          // filter out canceled requests
          return acc;
        }
        const request = getEvent({
          resourceId: id,
          bookingId: rawRequest.id,
          startDate: rawRequest.start_date_tz.replace('Z', ''), // drop time zone
          endDate: rawRequest.end_date_tz.replace('Z', ''), // drop time zone
          rawStartDate: rawRequest.start_date_tz,
          rawEndDate: rawRequest.end_date_tz,
          isPending: rawRequest.status === MESSAGE_STATUSES.REQUESTED,
          isAccepted: rawRequest.status !== MESSAGE_STATUSES.REQUESTED, // we show only pending and accepted requests. Canceled requests are filtered out
          hasNewMessage: !!rawRequest.has_new_message
        });

        if (rawRequest.rider) {
          const { first_name, last_name } = rawRequest.rider;
          request.rider = `${first_name} ${last_name}`;
          request.contact = rawRequest.rider.phone_number;
        }
        acc.push(request);
        return acc;
      }, []);
    }

    function parseClusterRequests({ id, requests }) {
      let clusterEventId;
      return [...requests]
        .sort(sortRequestsByStartDate)
        .reduce((acc, request) => {
          const last = acc[acc.length - 1];
          if (!last || request.startDate > last.endDate) {
            clusterEventId = uniqueId('cluster-event-');
            acc.push(
              getEvent({
                id: clusterEventId,
                resourceId: id,
                startDate: request.startDate,
                endDate: request.endDate,
                requestsCount: 1,
                isCluster: true
              })
            );
            request.clusterEventId = clusterEventId;
          } else {
            last.requestsCount += 1;
            last.endDate =
              request.endDate > last.endDate ? request.endDate : last.endDate;
            request.clusterEventId = clusterEventId;
          }

          return acc;
        }, []);
    }

    function parseAvailabilities({ id, availabilities }) {
      return availabilities.reduce((acc, availability) => {
        const { start_date, duration, active } = availability;
        if (!active) {
          return acc;
        }
        acc.push(
          getEvent({
            resourceId: id,
            startDate: DateHelper.format(new Date(start_date), 'YYYY-MM-DD'), // do not specify timezone Z
            duration: duration + 1,
            isNotAvailable: true
          })
        );
        return acc;
      }, []);
    }

    function parseRequestsWithMewMessages({ requests }) {
      return requests
        .filter(({ hasNewMessage }) => hasNewMessage)
        .sort(sortRequestsByStartDate);
    }

    function sortRequestsByStartDate(requestA, requestB) {
      return requestA.startDate.localeCompare(requestB.startDate); // sort date strings alphanumerically
    }

    function getResource(resourceData) {
      // all resources should have the same schema
      return Object.assign(
        {
          id: null,
          name: null,
          location: null,
          isCluster: false,
          isVariant: false,
          category: null,
          imageUrl: null,
          size: null,
          humanizeSize: null,
          variantIndex: null,
          cls: null,
          requestsWithNewMessages: [],
          children: [],
          requests: []
        },
        resourceData
      );
    }

    function getEvent(eventData) {
      // all events should have the same schema
      return Object.assign(
        {
          resourceId: null,
          bookingId: null,
          startDate: null,
          endDate: null,
          rawStartDate: null,
          rawEndDate: null,
          requestsCount: null,
          isCluster: false,
          isPending: false,
          isAccepted: false,
          isNotAvailable: false,
          hasNewMessage: false,
          isChangingStatus: false,
          clusterEventId: null,
          duration: null,
          rider: null,
          contact: null
        },
        eventData
      );
    }
  });
