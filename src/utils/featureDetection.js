const hasWebGl = () => {
	try {
		let canvas = document.createElement('canvas')
		return !!(window.WebGLRenderingContext && (
			canvas.getContext('webgl') ||
			canvas.getContext('experimental-webgl'))
		)
	} catch (e) {
		return false
	}
}

export {
	hasWebGl,
}