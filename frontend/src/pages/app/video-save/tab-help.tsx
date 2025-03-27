import { TabsContent } from "@/components/ui/tabs";

export const TabHelp = () => {
  return (
    <TabsContent value="help" className="overflow-y mx-2">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">
          How to Save Lyrics with Timestamps
        </h3>

        <div className="space-y-2">
          <h4 className="font-medium">Step 1: Find the Correct Video</h4>
          <p>
            Make sure the YouTube video has clear audio and is the official
            version of the song if possible.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Step 2: Format Your Lyrics</h4>
          <p>
            Each line should be preceded by a timestamp in the format [MM:SS.ms]
          </p>
          <div className="bg-slate-100 p-3 rounded-md font-mono text-sm">
            [00:12.34] This is an example line of lyrics
            <br />
            [00:16.78] This is the next line of the song
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Step 3: Using the Lyrics Controls</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Play the video and pause at the exact moment a line begins</li>
            <li>
              Click "Insert Timestamp" to automatically save the timestamp at
              your cursor position
            </li>
            <li>Type the lyrics for that line after the timestamp</li>
            <li>Continue this process for each line of the song</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Step 4: Review and Submit</h4>
          <p>
            Double-check your timestamps and lyrics for accuracy before
            submitting. Our team will review your contribution before publishing
            it.
          </p>
        </div>
      </div>
    </TabsContent>
  );
};
