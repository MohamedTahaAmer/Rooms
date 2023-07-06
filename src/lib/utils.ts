import { ClassValue, clsx } from 'clsx' // >(0:16)
import { twMerge } from 'tailwind-merge' // >(0:16)
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'

// >(0:34) this cn is used to compine dynamic classes with our string classes
  // https://github.com/MohamedTahaAmer/CodeMDs/blob/main/Next/01-cnHelper.md
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)) // >(0:16)
}

const formatDistanceLocale = {
  lessThanXSeconds: 'just now',
  xSeconds: 'just now',
  halfAMinute: 'just now',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      if (result === 'just now') return result
      return result + ' ago'
    }
  }

  return result
}

// >(5:33)
export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}
