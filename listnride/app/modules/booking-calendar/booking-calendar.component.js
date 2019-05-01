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
  controller: function BookingCalendarController($translate) {
    'use strict';
    const bookingCalendar = this;

    bookingCalendar.$onInit = () => {
      $translate([
        'shared.id',
        'booking.overview.size',
        'shared.label_new'
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
            cls: 'bike-event-popup-tooltip',
            template: ({ eventRecord }) =>
              bikeEventPopupRenderer({ eventRecord, translations })
          }
        },

        resources: [
          {
            id: 1,
            name: 'Destroyer of Worlds',
            imageUrl:
              'https://listnride-staging.s3.eu-central-1.amazonaws.com/uploads/ride/image_file_1/12271/1555531251-hell_rider.jpeg',
            expanded: true,
            size: 52,
            isNew: true,
            children: [
              {
                id: 3,
                name: 'Destroyer of Worlds',
                size: 52,
                isVariant: true,
                variantIndex: 1
              },
              {
                id: 4,
                name: 'Destroyer of Worlds',
                size: 54,
                isVariant: true,
                isNew: true,
                variantIndex: 2
              },
              {
                id: 5,
                name: 'Destroyer of Worlds',
                size: 56,
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
            size: 52
          }
        ],

        events: [
          {
            resourceId: 3,
            startDate: '2019-05-11 08:00:00',
            endDate: '2019-05-15 12:00:00',
            isPending: true
          },
          {
            resourceId: 4,
            startDate: '2019-05-06 14:00:00',
            endDate: '2019-05-09 12:00:00',
            isAccepted: true
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
            isPending: true
          }
        ],

        startDate,
        endDate
      });

      window.scheduler = bookingCalendar.scheduler;
    }
  }
});
