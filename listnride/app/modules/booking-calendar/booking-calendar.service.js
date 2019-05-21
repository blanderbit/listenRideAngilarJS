import { get } from 'lodash';
import { DateHelper } from '../../../js_modules/bryntum-scheduler/scheduler.module.min';

angular
  .module('listnride')
  .factory('bookingCalendarService', function(
    $localStorage,
    $translate,
    bikeOptions,
    api
  ) {
    return {
      getTranslationsForScheduler() {
        return $translate([
          // bikes column
          'shared.id',
          'booking.overview.size',
          'shared.label_new',
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
          .get(`/users/${$localStorage.userId}/rides`)
          .then(({ data }) => data.bikes)
          .then(bikes =>
            bikes.reduce(
              (acc, bike) => {
                const bikeResource = {
                  id: bike.id,
                  name: `${bike.brand} ${bike.name}`,
                  location: bike.location,
                  isCluster: bike.is_cluster,
                  category: bike.category,
                  imageUrl: bike.image_file,
                  size: bike.size,
                  isVariant: false,
                  isNew: false,
                  children: []
                };

                if (bikeResource.isCluster) {
                  /*
                 Variant's structure:
                 {
                  id: string, // unique id
                  name: string, // cluster bike name
                  size: string, // bike size
                  category: number, // bike category
                  isNew: boolean, // flag to show badge "New"
                  variantIndex: number, // index in a list of variants
                  isVariant: true, // always true for variants
                  cls: 'variant-row' // always the same, must be present for styling
                }
                */
                  bikeResource.children = Array.from(
                    { length: bike.rides_count },
                    (_, i) => ({
                      ...bikeResource,
                      id: `${bike.id}-${i}`,
                      isCluster: false,
                      isVariant: true,
                      variantIndex: i + 1,
                      cls: 'variant-row'
                    })
                  );
                }

                acc.bikes.push(bikeResource);

                acc.events.push(
                  // accepted/pending events
                  ...bike.requests.map(request => {
                    return {
                      resourceId: bike.id,
                      startDate: request.start_date,
                      endDate: request.end_date,
                      bookingId: request.id,
                      isPending: true,
                      isNotAvailable: false,
                      isAccepted: false,
                      rider: 'John Johnsen',
                      contact: '0173 263 273 283'
                    };
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
                
                acc.locations.set(bike.location.id, bike.location);

                return acc;
              },
              { bikes: [], events: [], locations: new Map() }
            )
          );
      }
    };
  });
