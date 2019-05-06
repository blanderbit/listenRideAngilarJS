import {
  Scheduler,
  PresetManager,
  DateHelper
} from '../../../js_modules/bryntum-scheduler/scheduler.module.min';

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
    $translate,
    $state,
    $filter,
    accessControl,
    bikeOptions
  ) {
    'use strict';
    const bookingCalendar = this;

    bookingCalendar.$onInit = () => {
      if (accessControl.requireLogin()) {
        return;
      }

      $translate([
        // bikes column
        'shared.id',
        'booking.overview.size',
        'shared.label_new',
        // events
        'booking-calendar.event.accepted',
        'booking-calendar.event.request-waiting',
        'booking-calendar.event.not-available',
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
      ]).then(translations => initScheduler(translations));
    };

    const viewPresetOptions = new Map([
      [
        'week',
        {
          key: 'week',
          label: 'shared.week',
          getTimeSpan: date => {
            const firstday = DateHelper.add(
              date,
              -1 * date.getDay() + 1,
              'day'
            );
            const lastday = DateHelper.add(firstday, 6, 'day');
            return [firstday, lastday].map(dropTimezone);
          }
        }
      ],
      [
        'month',
        {
          key: 'month',
          label: 'shared.month',
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
        ...viewPresetOptions
          .get(bookingCalendar.scheduler.viewPreset.name)
          .getTimeSpan(new Date())
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

    function initScheduler(translations) {
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
            // hideDelay: 15 * 60 * 1000,
            cls: 'bike-event-popup',
            template: ({ eventRecord }) =>
              bikeEventPopupRenderer({ eventRecord, translations, getters })
          }
        },

        resources: [
          {
            id: 1,
            name: 'Destroyer of Worlds and outer space',
            imageUrl:
              'https://listnride-staging.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/12271/1555531251-hell_rider.jpeg',
            expanded: true,
            size: 52,
            category: 10,
            isNew: true,
            children: [
              {
                id: 3,
                name: 'Destroyer of Worlds and outer space',
                size: 52,
                category: 11,
                isVariant: true,
                variantIndex: 1
              },
              {
                id: 4,
                name:
                  'TestTestTestTestTestTestTestTestTestTestTestTestTestTest',
                size: 54,
                category: 12,
                isVariant: true,
                isNew: true,
                variantIndex: 2
              },
              {
                id: 5,
                name: 'Destroyer of Worlds and outer space',
                size: 56,
                category: 20,
                isVariant: true,
                variantIndex: 3
              }
            ]
          },
          {
            id: 2,
            name: 'Barbie Ride',
            imageUrl:
              'https://listnride-staging.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/12275/1555610029-barbie.jpeg',
            size: 52,
            category: 21
          }
        ],

        events: [
          {
            resourceId: 3,
            startDate: '2019-05-11 08:00:00',
            endDate: '2019-05-15 12:00:00',
            isPending: true,
            bookingId: 1,
            rider: 'John Johnsen',
            contact: '0173 263 273 283'
          },
          {
            resourceId: 4,
            startDate: '2019-05-06 14:00:00',
            endDate: '2019-05-09 12:00:00',
            isAccepted: true,
            bookingId: 2,
            rider: 'John Johnsen',
            contact: '0173 263 273 283'
          },
          {
            resourceId: 5,
            startDate: '2019-05-10 09:00:00',
            endDate: '2019-05-15 00:00:00',
            isNotAvailable: true
          },
          {
            resourceId: 2,
            startDate: '2019-05-13 15:00:00',
            endDate: '2019-05-19 12:30:00',
            isPending: true,
            bookingId: 3,
            rider: 'John Johnsen',
            contact: '0173 263 273 283'
          }
        ],

        startDate,
        endDate
      });

      window.scheduler = bookingCalendar.scheduler;
    }
  }
});
