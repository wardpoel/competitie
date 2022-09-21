export default {
	root: 'source',
	build: { outDir: '../build', emptyOutDir: true },
	server: { open: '/' },
	esbuild: {
		jsxInject: `import React from 'react'`,
	},
};
