# services plan to spotify

It spits out text for a spotify playlist from a Planning Center Services plan

## Usage

```shell
$ APPLICATION_ID=personal_access_token_application_id APPLICATION_SECRET=personal_access_token_application_secret node build.js 1234
```

## Sample Output

```
GET plans/1234 {}
GET service_types/565431/plans/1234/items {}
GET service_types/565431/plans/1234/items/1235/arrangement/attachments {}
GET service_types/565431/plans/1234/items/1236/arrangement/attachments {}
GET service_types/565431/plans/1234/items/1237/arrangement/attachments {}
GET service_types/565431/plans/1234/items/1238/arrangement/attachments {}
GET service_types/565431/plans/1234/items/1239/arrangement/attachments {}
POST service_types/565431/plans/1234/items/1236/arrangement/attachments/1240/open {}
POST service_types/565431/plans/1234/items/1238/arrangement/attachments/1241/open {}
POST service_types/565431/plans/1234/items/1235/arrangement/attachments/1242/open {}
POST service_types/565431/plans/1234/items/1239/arrangement/attachments/1243/open {}
POST service_types/565431/plans/1234/items/1237/arrangement/attachments/1244/open {}
----------------------------------------------------------------------------------
Copy and paste these tracks into the Spotify app to add these tracks to a playlist
----------------------------------------------------------------------------------
spotify:track:0mKur0Or88hNvRkGxL7neI
spotify:track:1mwmlSGms4v4A7RqKY2nvn
spotify:track:6HndkGQ5RymiptDMVqwBII
spotify:track:20aRHdLW5tlHOK63737c0X
spotify:track:5JvJF5qgNHej4Sv6ikoXyH
```
