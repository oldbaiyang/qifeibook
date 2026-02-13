/**
 * 公共样式类名
 * 使用 Tailwind CSS 类名替代内联样式
 */

// 布局相关
export const cn = {
  // 容器样式
  container: 'px-4 py-8 md:px-6 lg:px-8',
  containerFluid: 'px-4 py-6 sm:px-6 lg:px-8',

  // 间距
  section: 'mb-12',        // marginBottom: '3rem'
  sectionHeader: 'mb-8',   // marginBottom: '2rem'
  subsection: 'mb-6',      // marginBottom: '1.5rem'
  marginBottom: 'mb-2',    // marginBottom: '0.5rem'
  marginTop: 'mt-2',       // marginTop: '0.5rem'

  // 文本样式
  title: 'text-2xl font-bold mb-2',           // fontSize: '1.75rem', fontWeight: '700'
  subtitle: 'text-xl font-semibold mb-2',     // fontSize: '1.5rem', fontWeight: 'bold'
  sectionTitle: 'text-2xl font-bold',         // fontSize: '1.75rem', fontWeight: '700'
  description: 'text-sm text-gray-600 mt-2',  // fontSize: '14px', color: '#666'
  text: 'text-gray-700',                      // 基本文本颜色
  textSmall: 'text-sm text-gray-500',         // 小文本
  textMuted: 'text-gray-500',                 // 弱化文本 #888

  // 链接样式
  link: 'text-blue-500 no-underline hover:underline',  // color: '#3b82f6', textDecoration: 'none'
  breadcrumbLink: 'text-blue-500 no-underline hover:underline',

  // 对齐
  textCenter: 'text-center',
  textLeft: 'text-left',
  textRight: 'text-right',

  // Flexbox
  flex: 'flex',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexWrap: 'flex flex-wrap',

  // Grid
  grid: 'grid',
  gridResponsive: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4',

  // 内边距
  p4: 'p-4',
  p8: 'p-8',

  // 外边距
  mt4: 'mt-4',
  mt8: 'mt-8',
  mb4: 'mb-4',

  // 其他
  breadcrumb: 'flex items-center gap-2 mb-6',       // 面包屑导航
  breadcrumbSeparator: 'text-gray-300 select-none', // 分隔符颜色 #ccc
  breadcrumbActive: 'text-gray-800 font-medium',     // 当前页 #333
  whiteSpacePre: 'whitespace-pre-wrap',              // whiteSpace: 'pre-wrap'

  // 加载状态
  loadingWrapper: 'text-center py-16',
  loadingSpinner: 'inline-block animate-spin',

  // 空状态
  emptyState: 'text-center py-16 text-gray-600',
};

/**
 * 动态合并类名工具函数
 */
export function mergeClasses(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
