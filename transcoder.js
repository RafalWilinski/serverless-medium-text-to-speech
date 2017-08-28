"use strict";

const AWS = require("aws-sdk");
const axios = require("axios");
const fs = require("fs");

const s3 = new AWS.S3({ region: "us-east-1" });
const polly = new AWS.Polly({ region: "us-east-1" });

const createResponse = (body, statusCode) => ({
  statusCode: statusCode || 200,
  body: JSON.stringify(body)
});

const upload = audioStreams =>
  Promise.all(
    audioStreams.map(audioStream => {
      return s3
        .upload({
          ACL: "public-read",
          ContentType: "audio/mp3",
          Bucket: process.env.TRANSCRIPTS_BUCKET,
          Key: audioStream.key,
          Body: audioStream.buffer,
          StorageClass: "REDUCED_REDUNDANCY"
        })
        .promise()
        .then(data => data.Location);
    })
  );

const synthesize = ({ title, subtitle, text }) => {
  const transcript = `${title}. ${subtitle}. ${text}`;

  // Due to AWS Polly character restrictions, we have to split our text into chunks.
  const splittedText = transcript.match(/.{1500}/g);

  return Promise.all(
    splittedText.map((chunk, index) => {
      return polly
        .synthesizeSpeech({
          OutputFormat: "mp3",
          VoiceId: "Joanna",
          TextType: "text",
          Text: chunk
        })
        .promise()
        .then(data => ({
          buffer: data.AudioStream,
          key: `${title}-${index}`
        }));
    })
  );
};

const downloadArticle = (url, callback) =>
  axios.get(url).then(response => {
    const json = JSON.parse(response.data.replace("])}while(1);</x>", ""));
    const text = json.payload.value.content.bodyModel.paragraphs
      .reduce((acc, paragraph) => acc.concat(paragraph.text), [])
      .join(" ");

    return {
      title: json.payload.value.title,
      subtitle: json.payload.value.content.subtitle,
      text
    };
  });

module.exports.handle = (event, context, callback) => {
  const url = `${JSON.parse(event.body).href}?format=json`;

  downloadArticle(url, callback)
    .then(synthesize)
    .then(audioStreams => {
      return upload(audioStreams);
    })
    .then(location => {
      callback(null, createResponse({ location }));
    })
    .catch(error => {
      callback(null, createResponse({ error }, 400));
    });
};
