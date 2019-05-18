import {
  Scheduler,
  PresetManager,
  DateHelper
} from '../../../js_modules/bryntum-scheduler/scheduler.module.min';
import { get } from 'lodash';

import { bikeColumnRenderer } from './renderers/bike-column/bike-column-renderer';
import { bikeEventPopupRenderer } from './renderers/bike-event-popup/bike-event-popup-renderer';
import { bikeEventRenderer } from './renderers/bike-event/bike-event-renderer';

import './booking-calendar.css';

const dropTimezone = date =>
  new Date(`${DateHelper.format(date, 'YYYY-MM-DD')}T00:00:00Z`);

angular.module('bookingCalendar', []).component('bookingCalendar', {
  templateUrl: 'app/modules/booking-calendar/booking-calendar.template.html',
  controllerAs: 'bookingCalendar',
  controller: function BookingCalendarController(
    $localStorage,
    $q,
    $translate,
    $state,
    $mdMenu,
    $filter,
    accessControl,
    bikeOptions,
    api
  ) {
    'use strict';
    const bookingCalendar = this;

    bookingCalendar.$onInit = () => {
      if (accessControl.requireLogin()) {
        return;
      }

      $q.all([getTranslationsForScheduler(), getRides()]).then(
        ([translations, rides]) => {
          initScheduler({ translations, rides });
          initDatepicker();
        }
      );
    };

    const viewPresetOptions = new Map([
      [
        'week',
        {
          key: 'week',
          labels: {
            option: 'shared.week',
            prev: 'booking-calendar.previous-week',
            next: 'booking-calendar.next-week'
          },
          getTimeSpan: date => {
            const firstDayOfWeek = DateHelper.add(
              date,
              -1 * date.getDay() + 1,
              'day'
            );
            const lastDayOfWeek = DateHelper.add(firstDayOfWeek, 6, 'day');
            return [firstDayOfWeek, lastDayOfWeek].map(dropTimezone);
          }
        }
      ],
      [
        'month',
        {
          key: 'month',
          labels: {
            option: 'shared.month',
            prev: 'booking-calendar.previous-month',
            next: 'booking-calendar.next-month'
          },
          getTimeSpan: date => {
            return [
              DateHelper.getFirstDateOfMonth(date),
              DateHelper.getLastDateOfMonth(date)
            ].map(dropTimezone);
          }
        }
      ]
    ]);

    bookingCalendar.viewPresetOptions = Array.from(viewPresetOptions.values());

    bookingCalendar.gotoToday = () => {
      bookingCalendar.scheduler.setTimeSpan(
        ...bookingCalendar.getCurrentViewPreset().getTimeSpan(new Date())
      );
    };

    bookingCalendar.setViewPreset = presetName => {
      const anchorDate = bookingCalendar.scheduler.startDate; // date that new time span should contain
      bookingCalendar.scheduler.setTimeSpan(
        ...viewPresetOptions.get(presetName).getTimeSpan(anchorDate)
      );
      bookingCalendar.scheduler.setViewPreset(presetName);
    };

    bookingCalendar.shiftPrevious = () => {
      bookingCalendar.scheduler.shiftPrevious();
    };

    bookingCalendar.shiftNext = () => {
      bookingCalendar.scheduler.shiftNext();
    };

    bookingCalendar.openDatepickerMenu = ($mdOpenMenu, $event) => {
      $mdOpenMenu($event);
    };

    bookingCalendar.getCurrentViewPreset = () => {
      return viewPresetOptions.get(bookingCalendar.scheduler.viewPreset.name);
    };

    bookingCalendar.getShiftButtonTooltip = direction => {
      if (!bookingCalendar.scheduler) {
        // scheduler hasn't been instantiated yet
        return '';
      }
      return bookingCalendar.getCurrentViewPreset().labels[direction];
    };

    function initScheduler({ translations, rides }) {
      // getters needed for event popups
      const getters = {
        getCategoryLabel: category =>
          translations[$filter('category')(category)],
        // TODO: verify link addresses
        getBikeListingsHref: () => $state.href('listings'),
        getBookingHref: requestId => $state.href('requests', { requestId })
      };

      PresetManager.registerPreset('week', {
        tickWidth: 150,
        displayDateFormat: 'MMMM DD, HH:mm',
        shiftUnit: 'week',
        shiftIncrement: 1,
        timeResolution: {
          unit: 'week',
          increment: 1
        },
        headerConfig: {
          top: {
            unit: 'month',
            dateFormat: 'MMMM YYYY'
          },
          middle: {
            unit: 'day',
            dateFormat: 'dddd DD'
          }
        }
      });

      PresetManager.registerPreset('month', {
        tickWidth: 50,
        displayDateFormat: 'MMMM DD, HH:mm',
        shiftUnit: 'month',
        shiftIncrement: 1,
        timeResolution: {
          unit: 'month',
          increment: 1
        },
        headerConfig: {
          top: {
            unit: 'month',
            dateFormat: 'MMMM YYYY'
          },
          middle: {
            unit: 'day',
            dateFormat: 'DD'
          }
        }
      });

      const defaultPreset = 'month';
      const [startDate, endDate] = viewPresetOptions
        .get(defaultPreset)
        .getTimeSpan(new Date());

      bookingCalendar.scheduler = new Scheduler({
        appendTo: document.querySelector('.scheduler-container'),
        readOnly: true,
        zoomOnMouseWheel: false,
        zoomOnTimeAxisDoubleClick: false,
        viewPreset: defaultPreset,
        weekStartDay: 1, // monday
        barMargin: 2,
        rowHeight: 85,
        eventSelectedCls: 'selected-event',
        focusCls: 'focused-event',

        eventRenderer: ({ eventRecord, resourceRecord, tplData }) =>
          bikeEventRenderer({
            eventRecord,
            resourceRecord,
            tplData,
            translations
          }),

        columns: [
          {
            type: 'tree',
            text: 'Name',
            field: 'name',
            width: 300,
            leafIconCls: null,
            expandIconCls: 'fa-chevron-down',
            collapseIconCls: 'fa-chevron-up',
            renderer: ({ cellElement, record }) =>
              bikeColumnRenderer({ cellElement, record, translations })
          }
        ],

        features: {
          contextMenu: false,
          eventFilter: false,
          headerContextMenu: false,
          timeRanges: {
            showCurrentTimeLine: true,
            showHeaderElements: true
          },
          tree: true,
          eventTooltip: {
            anchor: false,
            cls: 'bike-event-popup',
            template: ({ eventRecord }) =>
              bikeEventPopupRenderer({ eventRecord, translations, getters })
          }
        },

        resources: rides.bikes,

        events: rides.events,

        startDate,
        endDate
      });

      bookingCalendar.scheduler.on({
        eventclick: ({ resourceRecord }) => {
          // expand bike cluster on cluster event click
          bookingCalendar.scheduler.toggleCollapse(resourceRecord);
        }
      });
    }

    function initDatepicker() {
      getDatepickerElement()
        .dateRangePicker({
          alwaysOpen: true,
          container: '#booking-calendar-datepicker',
          inline: true,
          showTopbar: false,
          singleMonth: true,
          startOfWeek: 'monday',
          language: $translate.preferredLanguage(),
          singleDate: true
        })
        .bind('datepicker-change', (event, { value }) => {
          bookingCalendar.scheduler.setTimeSpan(
            ...bookingCalendar
              .getCurrentViewPreset()
              .getTimeSpan(new Date(value))
          );
          $mdMenu.hide();
          getDatepickerElement()
            .data('dateRangePicker')
            .clear();
        });
    }

    function getDatepickerElement() {
      return angular.element('#booking-calendar-datepicker');
    }

    function getTranslationsForScheduler() {
      return $translate([
        // bikes column
        'shared.id',
        'booking.overview.size',
        'shared.label_new',
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
    }

    function getRides() {
      return api
        .get(`/users/${$localStorage.userId}/rides`)
        .then(({ data }) => data.bikes)
        .then(bikes =>
          bikes.reduce(
            (acc, bike) => {
              const bikeResource = {
                id: bike.id,
                name: bike.name,
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
                      startDate: DateHelper.format(new Date(start_date), 'YYYY-MM-DD'), // do not specify timezone Z
                      duration: duration + 1,
                      isNotAvailable: true,
                      isPending: false,
                      isAccepted: false,
                    };
                  })
              );

              return acc;
            },
            { bikes: [], events: [] }
          )
        );
    }
  }
});
