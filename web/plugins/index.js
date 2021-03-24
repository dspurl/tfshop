/**
 * @returns {string}
 */
export function createUniqueString() {
	const randomNum = parseInt((1 + Math.random()) * 65536) + ''
	return (randomNum + new Date().getMilliseconds())
}
