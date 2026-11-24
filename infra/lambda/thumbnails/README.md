# Thumbnail Lambda (Phase 3)

Triggered by an S3 upload event. Uses `sharp` to create thumbnails and compressed copies of gallery photos,
then marks the `media` record as `ready`. Added during the gallery phase.
