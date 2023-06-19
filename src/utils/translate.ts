import { translate } from 'bing-translate-api'

export const translator = (text: string) => {
	return translate(text, null, 'en')
}
