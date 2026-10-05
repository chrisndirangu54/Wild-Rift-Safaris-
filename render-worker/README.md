# Story Director render worker
Container boundary for FFmpeg-based Reel/film rendering. Current endpoint validates a director manifest and returns accepted; it intentionally does not claim rendering is live until storage, signed-media retrieval, captions/narration, music licensing, FFmpeg composition and completion callbacks are wired.

Target outputs: 1080x1920 Reel and 1920x1080 landscape film.

Never auto-publish. Never render music without stored license/usage metadata. Keep sensitive wildlife coordinates out of map frames.
