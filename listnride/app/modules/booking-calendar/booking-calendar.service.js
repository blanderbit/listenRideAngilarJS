import { get } from 'lodash';
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
      MESSAGE_STATUSES.COMPLETE,
    ];

    return {
      getTranslationsForScheduler() {
        return $translate([
          // bikes column
          'shared.id',
          'booking.overview.size',
          'search.unisize',
          'shared.label_new',
          'shared.status-labels.variants_available',
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
          'booking-calendar.event.view-booking',
          ...bikeOptions.categoriesTranslationKeys()
        ]);
      },

      getRides() {
        return api
          .get(`/users/${$localStorage.userId}/rides?detailed=true`)
          .then(({ data }) => data.bikes)
          .then(bikes => this.parseBikes(bikes));
      },

      parseBikes(bikes) {
        return bikes.reduce(
          (acc, bike) => {
            const bikeResource = {
              id: bike.id,
              name: `${bike.brand} ${bike.name}`,
              location: bike.location,
              isCluster: bike.is_cluster,
              isVariant: false,
              category: bike.category,
              imageUrl: bike.image_file,
              size: bike.size,
              isNew: false,
              children: []
            };

            if (bikeResource.isCluster) {
              bike.rides.forEach((bikeVariant, index) => {
                const bikeVariantId = `${bike.id}-${index}`;
                bikeResource.children.push({
                  ...bikeResource,
                  children: [],
                  id: bikeVariantId,
                  size: bikeVariant.size,
                  isCluster: false,
                  isVariant: true,
                  variantIndex: index + 1,
                  cls: 'variant-row'
                });
                acc.events.push(
                  ...this.parseRequests({
                    id: bikeVariantId,
                    isCluster: false,
                    requests: bikeVariant.requests
                  })
                );
              });
            }

            acc.bikes.push(bikeResource);

            acc.events.push(
              // accepted/pending events
              ...this.parseRequests({
                id: bikeResource.id,
                isCluster: bikeResource.isCluster,
                requests: bike.requests
              }),
              // not available events
              ...Object.values(get(bike, 'availabilities', {}))
                .filter(({ active }) => active)
                .map(({ start_date, duration }) => {
                  return {
                    resourceId: bike.id,
                    startDate: DateHelper.format(
                      new Date(start_date),
                      'YYYY-MM-DD'
                    ), // do not specify timezone Z
                    duration: duration + 1,
                    isNotAvailable: true,
                    isPending: false,
                    isAccepted: false
                  };
                })
            );

            acc.locations.add(bike.location.en_city);

            return acc;
          },
          { bikes: [], events: [], locations: new Set() }
        );
      },

      parseRequests({ id, isCluster, requests }) {
        return requests
          .filter(request => ALLOWED_REQUEST_STATUSES.includes(request.status))
          .map(rawRequest => {
            console.count('COUNT')
            const request = {
              resourceId: id,
              bookingId: rawRequest.id,
              startDate: rawRequest.start_date,
              endDate: rawRequest.end_date,
              isCluster,
              isPending: rawRequest.status === MESSAGE_STATUSES.REQUESTED,
              isAccepted:rawRequest.status !== MESSAGE_STATUSES.REQUESTED, // we show only pending and accepted requests. Canceled requests are filtered out
              isNotAvailable: false
            };

            if (!isCluster) {
              const { first_name, last_name } = rawRequest.rider;
              request.rider = `${first_name} ${last_name}`;
              request.contact = rawRequest.rider.phone_number;
            }

            return request;
          });
      }
    };
  });
