const { exec } = require('child_process')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')

const DEFAULTS = {
	imagePath: './images',
	imagePattern: 'image-%05d.png',
	outputVideo: './output/output.mp4',
	fps: 24,
	imageDuration: 2,
}

// Parse command-line arguments using yargs
const argv = yargs(hideBin(process.argv))
	.option('imagePath', {
		alias: 'i',
		type: 'string',
		description: 'Path to the images',
		default: DEFAULTS.imagePath,
	})
	.option('imagePattern', {
		alias: 'p',
		type: 'string',
		description: 'Pattern for zero-padded filenames',
		default: DEFAULTS.imagePattern,
	})
	.option('outputVideo', {
		alias: 'o',
		type: 'string',
		description: 'Output video filename',
		default: DEFAULTS.outputVideo,
	})
	.option('fps', {
		alias: 'f',
		type: 'number',
		description: 'Frames per second',
		default: DEFAULTS.fps,
	})
	.option('imageDuration', {
		alias: 'd',
		type: 'number',
		description: 'Duration each image should display (in seconds)',
		default: DEFAULTS.imageDuration,
	})
	.help().argv

function createVideoFromImages(
	imagePath,
	imagePattern,
	outputVideo,
	fps,
	imageDuration,
) {
	// Calculate the effective frame rate for input images
	const effectiveFramerate = 1 / imageDuration
	const command = `ffmpeg -framerate ${effectiveFramerate} -i "${imagePath}/${imagePattern}" -vf "fps=${fps}" -c:v libx264 -pix_fmt yuv420p "${outputVideo}"`
  // Delete output video if it exists
  if (fs.existsSync(outputVideo)) {
    fs.unlinkSync(outputVideo)
  }

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing ffmpeg: ${error.message}`)
			return
		}
		if (stderr) {
			console.error(`FFmpeg stderr: ${stderr}`)
			return
		}
		console.log(`Video created successfully: ${outputVideo}`)
	})
}



const {
  imagePath,
  imagePattern,
  outputVideo,
  fps,
  imageDuration,
} = argv

// Call the function with arguments from yargs
createVideoFromImages(
	imagePath,
	imagePattern,
	outputVideo,
	fps,
	imageDuration,
)
