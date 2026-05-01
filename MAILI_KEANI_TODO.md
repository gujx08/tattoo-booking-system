# Maili Cohen and Keani Chavez — pending photo and video uploads

These artists have placeholder Bunny URLs in src/data/artists.ts. Photos
and videos were never uploaded to Cloudinary and are still missing.
Production has been showing broken images and videos for these two artist
cards.

When assets arrive, upload to Bunny — no code change required, the URLs
are already wired up.

## Pending photo uploads

Upload to Bunny Storage Zone "patch-images" at these exact paths
(filenames are case-sensitive, must match):

Maili Cohen:
- artists/maili.jpg                  (profile avatar)
- portfolio/maili/work_1.jpg         (portfolio image 1)
- portfolio/maili/work_2.jpg         (portfolio image 2)
- portfolio/maili/work_3.jpg         (portfolio image 3)
- portfolio/maili/work_4.jpg         (portfolio image 4)

Keani Chavez:
- artists/keani.jpg
- portfolio/keani/work_1.jpg
- portfolio/keani/work_2.jpg
- portfolio/keani/work_3.jpg
- portfolio/keani/work_4.jpg

No code change is required once uploaded. Bunny CDN will start serving
them automatically and the broken `<img>` tags will resolve.

## Pending video uploads

Empty video objects exist in Bunny Stream library 647194. To upload the
actual video files when they arrive, use the Stream API with the GUIDs
below — do NOT create new video objects, that would orphan the GUIDs
already wired into artists.ts.

Maili Cohen intro:
- GUID: fbe29c57-5eec-438e-8879-d7d609ee3d4c
- Upload endpoint: PUT https://video.bunnycdn.com/library/647194/videos/fbe29c57-5eec-438e-8879-d7d609ee3d4c
- HLS URL (already in artists.ts): https://vz-84d1a0c9-63f.b-cdn.net/fbe29c57-5eec-438e-8879-d7d609ee3d4c/playlist.m3u8

Keani Chavez intro:
- GUID: 5cd89055-f43e-4a4c-9b09-bd7b669b0569
- Upload endpoint: PUT https://video.bunnycdn.com/library/647194/videos/5cd89055-f43e-4a4c-9b09-bd7b669b0569
- HLS URL (already in artists.ts): https://vz-84d1a0c9-63f.b-cdn.net/5cd89055-f43e-4a4c-9b09-bd7b669b0569/playlist.m3u8

Bunny will transcode after upload (1-3 min for short intros). HLS URL
will return 404 until then, same as today.
