import { google } from 'googleapis';

export function getGoogleAuth(subjectEmail: string) {
  return new google.auth.JWT({
    email: 'calendar-bot@ferrous-amphora-448210-u1.iam.gserviceaccount.com',
    key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCUhc5EKwLVonux\neQCJwo+rlRiiCFl7JKq6rjhrfp30oAJRXR3d1LX9VjoYO188QRgyvcsnYaGXgcwM\ntSUiPyp0BLbMNbBAfJC20JgagAX1k59GQYTaeKbOV0L8woR7l8yVMW4se+AJc7ka\nzDGQLuzQ9f1R9SkJzR9OLOFuQfZgP2iEgxTnN0fRZUyMcQzJTqAuRdMkXGQ117rQ\n0TlkUMGI/g4twfLPb00JbvToJK+OmPFcpgJ5qjiw+bUbRxUgFTFQ9rAm4yBL1p5c\nmgrEVTYJ35G8l8ToI3Y8VY5PEyModshzj8HkMwzhaQo1aQxKumjVIdOtufVrUFol\n//MuOKb9AgMBAAECgf8StciGTeTNhOqQMO4gbKIsu1ufDe431Sas3cW9xPWhG4cv\nOMvKZkGG6JXo95HHxWuG+OHe1C3HKFLMRwWmis6OTwm4MAtEFG0mmqCOthIKHc6y\nyw4xd4GL/PIzZU3LRBRBtzhp4jEW/70R4ydbQo4SxOpkqL3CvlRzRLQhb63Z8fG1\nxq8Kh9W7wHGMQlbxbgqNMI5uBvYgfwLJi5U+vsjUI08rCdCAK/+QCzV/PVi0B6Ui\nPuZ3gdAKvPKQ8zdgSC+f0dQYBHcNvYnOfwOqlNY64SO41O0Ht5ZA53KasamfVAZC\nLuZ69OJ76cyTsyVctZ2qG/Glkja2+K28V+RnjOECgYEA0d3j3AMGxEv6gdF5HXkq\nCXeI0ZRiKRiDAlTHoSH6DU6x8ZFo2Z1Z0kLnJAtpRYHv8/K40JUDAP3BQXfAZzda\nvCtHZgkHX878ejPDj1rnzoZ/+LIO54lTzuu3HUWmwRyRYasRNxwrQ2syqLXD8W3R\nPwa44VscIEIO8eErfbri3iECgYEAtSvRrXFfJCd1S1QmeJ9eQ4NLCI1UZYzMrkv2\nx5EY8yUVb4PCakAVfOH6vq2DGx+AhQuJsy7QqG1cQZhum3GsEqqZ1bfjOPo6psNa\n4VDahscdKRqjeUHkjb/SbQBcX4j+CNLAwQyjpjZT4pGDlWj5NrbLT4wMFl1eCVp8\nICJtVV0CgYEAlbWDGWyzRA6rOjZS/tpzSWOTH2aJi6Vnt58A9YpGVX3g5GGFeU+N\nRrfhKU5Wn3Xs1Yo9mtXh2bArT2d8wmSzfm4lNb2VHByM8SPCCp6fpC1AVwm2JidJ\nuN9ftir8pN+bOiANXNHkbuimr8FScQSU8y/5bRFQhBZ7kMK/AqbxteECgYAVRard\n8ZTZOuTTznKh8RxxUuYpf+ar8cdKo9K7Bfdm/TCyIkdekF21hxcY8miVc7J0bLFj\nX5jSXdzaOtqp18P7gRqE9I1ycDcYw5FVKVgvQQvUerM9FpaOajp73/H4qa4iPRSy\n1hgU+QYKcUmA7o1sdjQTB/+XVKko8f3nDAPIZQKBgDMwSbq8DU0U/u8FLmiZ9bzs\n9vfH7kOkKGzTWk1X4dma+lch8e4ymN74xqq7o8/s/PNfpmDrTPK2Tl3YrPM6KHsI\nHYDq1K6hkQiylP0HMuq0iX0OsfTshnZfXO/CK5e9BAJGumNw5Hxt2h5Jf89ADXJt\n5YFg6rvsaXKcDfENc4VN\n-----END PRIVATE KEY-----\n",
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
    subject: "upskillab@upskillab.in",
  });
}
