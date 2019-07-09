// https://github.com/tradingview/charting_library/wiki/Widget-Constructor#overrides
// https://github.com/tradingview/charting_library/wiki/Overrides
// https://github.com/tradingview/charting_library/wiki/Customization-Use-Cases

const disabled_features = [
  'symbol_search_hot_key',
  // 'header_settings',
  'header_resolutions',
  'header_symbol_search',
  'header_interval_dialog_button',
  'header_chart_type',
  // 'header_indicators',
  'header_compare',
  'header_undo_redo',
  'header_screenshot',
  'header_saveload',
  // 'header_fullscreen_button',

  'compare_symbol',
  'border_around_the_chart',
  'remove_library_container_border',
  'timeframes_toolbar',
  'edit_buttons_in_legend',
  'countdown',
  'symbol_info',
  'timezone_menu',
  'context_menus',
  'volume_force_overlay',

  'use_localstorage_for_settings',
  'save_chart_properties_to_local_storage'
];

const enabled_features = ['hide_left_toolbar_by_default'];

const overrides = {
  volumePaneSize: 'medium',

  'paneProperties.background': '#11253f',
  'paneProperties.vertGridProperties.color': 'rgba(255,255,255,0.03)',
  'paneProperties.horzGridProperties.color': 'rgba(255,255,255,0.03)',

  // 'paneProperties.topMargin': 5,
  // 'paneProperties.bottomMargin': 5,

  'symbolWatermarkProqperties.color': 'rgba(0, 0, 0, 0)',
  'scalesProperties.lineColor': '#243c5e',
  'scalesProperties.textColor': '#3d6496',

  // Candles styles
  'mainSeriesProperties.style': 1,
  'mainSeriesProperties.candleStyle.upColor': '#008ed4',
  'mainSeriesProperties.candleStyle.downColor': '#e05140',
  'mainSeriesProperties.candleStyle.drawWick': true,
  'mainSeriesProperties.candleStyle.drawBorder': true,
  'mainSeriesProperties.candleStyle.borderColor': '#378658',
  'mainSeriesProperties.candleStyle.borderUpColor': '#008ed4',
  'mainSeriesProperties.candleStyle.borderDownColor': '#e05140',
  'mainSeriesProperties.candleStyle.wickUpColor': '#3d6496',
  'mainSeriesProperties.candleStyle.wickDownColor': '#3d6496',
  'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

  'paneProperties.legendProperties.showStudyArguments': false,
  'paneProperties.legendProperties.showStudyTitles': false,
  'paneProperties.legendProperties.showStudyValues': false,
  'paneProperties.legendProperties.showSeriesTitle': false,
  'paneProperties.legendProperties.showSeriesOHLC': true,

  // Line styles
  'mainSeriesProperties.lineStyle.linewidth': 5,

  // Area styles
  'mainSeriesProperties.areaStyle.color1': '#243c5e',
  'mainSeriesProperties.areaStyle.color2': '#243c5e',
  'mainSeriesProperties.areaStyle.linecolor': '#008ed4',
  // mainSeriesProperties.areaStyle.linestyle: LINESTYLE_SOLID
  'mainSeriesProperties.areaStyle.linewidth': 5,
  // mainSeriesProperties.areaStyle.priceSource: "close"

  'timeScale.rightOffset': 1
};

const studies_overrides = {
  'volume.volume.color.0': '#3d6496',
  'volume.volume.color.1': '#3d6496',
  'volume.volume.transparency': 90
};

const baseConfig = {
  debug: process.env.NODE_ENV === 'development',
  container_id: 'MarketChartNode',
  library_path: '/charting_library/',
  allow_symbol_change: false,
  width: '100%',
  height: '500',
  toolbar_bg: '#11253f',
  loading_screen: { backgroundColor: '#11253f' },
  custom_css_url: '/static/tradingview.css?v=3',
  overrides,
  studies_overrides,
  disabled_features,
  enabled_features
};

export default function createWidgetConfig(options) {
  return Object.assign({}, baseConfig, options);
}
