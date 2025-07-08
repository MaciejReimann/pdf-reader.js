# A fork of PDF.js

The changes to the original repo:

- added gulp task to bundle TS modules and transpile TS
- minimal UI to the `web/viewer.hmtl`
- `/src/pdf-reader` folder where the TS modules are placed
- `web/custom_find_controller.js` and `web/custom_find_highlight.css` - alternative versions of original files that deliver desired behavior

## New Features

### Reader

Click "Read" button and listen to the pdf being read out-loud.

1. LLM-based visual analysis
   - examines syntactical structure: what are the sections, titles, and sentences?
   - assigns semantical relevance: how relevant is a given section to a reader?
  
2. WordMap: relates the structure to the position of its elements on the rendered document
   - allows for physical location on the pdf of each word within each sentence
  
3. Create audio file with temporal references 
    - combines OpenAI's `speech` API with `transcription` API that returns audio with timestamps for each word

4. Play audio file
   - synchronized with Highlighter thanks to transcription timestamps and WordMap traverse API
  
### Highlighter

Walk through the pdf and highlight sentences and words one by one.

1. Leverages the pdf.js' internal event-based "find" and "highlight" functionalities
2. Highlights the current sentence and word

## TODOs

- refactor wordMap, so it correctly relate words to sentences keeping track of its physical location:
  
```ts
const finder = new Finder(wordMap)
```

- programmatically highlight each character sequence, like:

```ts
const finder = new Finder(wordMap)
const matches = await finder.find("Receptors in the")

matches.highlightAll()
matches.highlightById(42)
```

- programmatically highlight several character sequences, at the same time like:

```ts
const wordFinder = new Finder(wordMap)
const wordMatches = await wordFinder.find("the")

const sentenceFinder = new Finder()
const sentenceMatches =  await sentenceFinder.find("Our somatosensory system consists of sensors")

sentenceMatches.highlightById(0, "red")
wordMatches.highlightById(1, "blue")
```

- run Reader that will call Finder with string arguments (currently read Sentence, and Word) at the timestamps provided by `prepareAudioForSentences`

## Run locally

1. clone repo
2. run `npm install` (Node v22)
3. run `npx gulp server`
4. Open `http://localhost:8888/web/viewer.html`