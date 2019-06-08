import { get, uniqueId } from 'lodash';
import { DateHelper } from '../../../js_modules/bryntum-scheduler/scheduler.module.min';

angular
  .module('listnride')
  .factory('bookingCalendarService', function(
    $localStorage,
    $translate,
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
          'seo.bikes',
          // event popups
          'booking-calendar.event.waiting',
          'booking-calendar.event.not-available-header',
          'booking-calendar.event.not-available-text',
          'booking-calendar.event.see-settings',
          'booking-calendar.event.date',
          'booking-calendar.event.pickup',
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
      return bikes.reduce(
        (acc, bike) => {
          // bike boilerplate
          const bikeResource = {
            id: bike.id,
            name: `${bike.brand} ${bike.name}`,
            location: bike.location,
            isCluster: bike.is_cluster,
            isVariant: false,
            category: bike.category,
            imageUrl: bike.image_file,
            size: bike.size,
            variantIndex: null,
            requestsWithNewMessages: [],
            children: []
          };

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
              const bikeVariantId = `${bikeResource.id}-${index}`;

              // add variant requests
              const variantRequests = parseRequests({
                id: bikeVariantId,
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
                  id: bikeVariantId,
                  size: bikeVariant.size,
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
        const request = {
          resourceId: id,
          bookingId: rawRequest.id,
          startDate: rawRequest.start_date,
          endDate: rawRequest.end_date,
          bikesCount: null,
          isCluster: false,
          isPending: rawRequest.status === MESSAGE_STATUSES.REQUESTED,
          isAccepted: rawRequest.status !== MESSAGE_STATUSES.REQUESTED, // we show only pending and accepted requests. Canceled requests are filtered out
          isNotAvailable: false,
          hasNewMessage: !!rawRequest.has_new_message,
          isChangingStatus: false,
          clusterEventId: null
        };

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
            acc.push({
              id: clusterEventId,
              resourceId: id,
              bookingId: null,
              startDate: request.startDate,
              endDate: request.endDate,
              bikesCount: 1,
              isCluster: true,
              isPending: false,
              isAccepted: false,
              isNotAvailable: false,
              hasNewMessages: null,
              isChangingStatus: false,
              clusterEventId: null
            });
            request.clusterEventId = clusterEventId;
          } else {
            last.bikesCount += 1;
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
        acc.push({
          resourceId: id,
          bookingId: null,
          startDate: DateHelper.format(new Date(start_date), 'YYYY-MM-DD'), // do not specify timezone Z
          duration: duration + 1,
          bikesCount: null,
          isNotAvailable: true,
          isPending: false,
          isAccepted: false,
          hasNewMessages: null,
          isChangingStatus: false,
          clusterEventId: null
        });
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
  });
