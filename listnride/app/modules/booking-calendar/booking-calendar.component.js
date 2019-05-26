import {
  Scheduler,
  PresetManager,
  DateHelper
} from '../../../js_modules/bryntum-scheduler/scheduler.module.min';
import moment from 'moment';

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
    $log,
    $q,
    $translate,
    $state,
    $stateParams,
    $mdMenu,
    $filter,
    accessControl,
    bookingCalendarService
  ) {
    'use strict';
    const bookingCalendar = this;

    bookingCalendar.anyLocationKey = 'ANY_LOCATION';
    bookingCalendar.locationOptions = [];
    bookingCalendar.filters = {
      onlyWithEvents: false,
      location: bookingCalendar.anyLocationKey
    };

    bookingCalendar.$onInit = () => {
      if (accessControl.requireLogin()) {
        return;
      }

      const goToDate = getDateFromStateParams();

      $q.all([
        bookingCalendarService.getTranslationsForScheduler(),
        bookingCalendarService.getRides()
      ]).then(([translations, rides]) => {
        bookingCalendar.locationOptions = Array.from(rides.locations);
        initScheduler({ translations, rides, goToDate });
        initDatepicker();
      });
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
            const day = date.getDay();
            const diff = (day === 0 ? -6 : 1) - day;
            const firstDayOfWeek = DateHelper.add(date, diff, 'day');
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

    bookingCalendar.filterBikes = () => {
      // check that scheduler has been instantiated
      if (!bookingCalendar.scheduler) {
        return;
      }

      // clear filter, so filtered out entries could reappear
      bookingCalendar.scheduler.resourceStore.clearFilters();

      // check if there are filters to apply
      if (Object.values(bookingCalendar.filters).every(filter => !filter)) {
        return;
      }

      // set bikes filter
      bookingCalendar.scheduler.resourceStore.filterBy(resource => {
        let eventsCountMatch = true;
        let locationMatch = true;

        // filter by events presence
        if (bookingCalendar.filters.onlyWithEvents) {
          eventsCountMatch = resource.events.some(event => {
            return DateHelper.intersectSpans(
              event.startDate,
              event.endDate,
              bookingCalendar.scheduler.startDate,
              bookingCalendar.scheduler.endDate
            );
          });
        }

        // filter by location
        if (
          bookingCalendar.filters.location !== bookingCalendar.anyLocationKey
        ) {
          locationMatch =
            resource.data.location &&
            resource.data.location.en_city === bookingCalendar.filters.location;
        }

        return eventsCountMatch && locationMatch;
      });
    };

    function initScheduler({ translations, rides, goToDate }) {
      registerViewPresets();

      // getters needed for event popups
      const getters = {
        getCategoryLabel: category =>
          translations[$filter('category')(category)],
        getBikeListingsHref: () => $state.href('listings'),
        getBookingHref: requestId => $state.href('requests', { requestId })
      };

      const defaultPreset = 'month';
      const [startDate, endDate] = viewPresetOptions
        .get(defaultPreset)
        .getTimeSpan(goToDate);

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
        emptyText: translations['booking-calendar.no-bikes-to-display'],

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
        eventclick: ({ resourceRecord, eventRecord }) => {
          $log.debug('Clicked bike event:', eventRecord.originalData);
          // expand bike cluster on cluster event click
          bookingCalendar.scheduler.toggleCollapse(resourceRecord);
        },
        cellClick: clickEvent => {
          if (
            clickEvent.target.getAttribute('data-id') === 'new-messages-badge'
          ) {
            const bike = clickEvent.record;
            const [request] = bike.requestsWithNewMessages;
            const event = bookingCalendar.scheduler.eventStore.find(
              ({ bookingId }) => bookingId === request.bookingId
            );
            if (
              bike.isCluster &&
              !bike.isExpanded(bookingCalendar.scheduler.resourceStore)
            ) {
              bookingCalendar.scheduler.expand(bike);
            }
            bookingCalendar.scheduler.setTimeSpan(
              ...bookingCalendar
                .getCurrentViewPreset()
                .getTimeSpan(new Date(event.startDate))
            );
            bookingCalendar.scheduler.scrollEventIntoView(event, {
              highlight: true,
              focus: true,
            });
          }
        }
      });

      // on start/end date change
      bookingCalendar.scheduler.on('timeaxischange', () => {
        bookingCalendar.filterBikes();
      });

      bookingCalendar.filterBikes();
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

    function registerViewPresets() {
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
    }

    function getDateFromStateParams() {
      const goToDate = moment(
        $stateParams.goToDate,
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
        true
      );
      return goToDate.isValid() ? goToDate.toDate() : new Date(); // today
    }
  }
});
