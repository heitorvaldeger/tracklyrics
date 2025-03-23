import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Headphones, Music, Play, Search } from "lucide-react";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="from-background to-muted w-full py-12 md:py-12 lg:py-24">
        <div className="container px-2">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Learn Languages Through Music
                </h1>
                <p className="text-muted-foreground max-w-[600px] text-center md:text-xl">
                  Improve your language skills by filling in missing lyrics
                  while enjoying your favorite songs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/">
                  <Button size="lg" className="gap-1">
                    <Play className="h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="lg" variant="outline">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex items-center justify-center lg:ml-auto">
              <img
                src="https://kzmk5q64oo9yruvy7tdb.lite.vusercontent.net/placeholder.svg?height=400&width=400"
                alt="Music learning illustration"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full border-y py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Find Your Favorite Songs
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-lg">
                Search for songs by artist, title, or language to start
                learning.
              </p>
            </div>
            <div className="flex w-full max-w-md space-x-2">
              <Input
                placeholder="Search for songs, artists, or lyrics..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted my-12 w-full rounded-md py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Why Learn with LyricsMaster?
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-lg">
                Our platform makes language learning fun and effective.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="bg-background flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="bg-primary/10 rounded-full p-3">
                  <Music className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Learn with Music</h3>
                <p className="text-muted-foreground text-center">
                  Music helps you remember vocabulary and phrases more
                  effectively.
                </p>
              </div>
              <div className="bg-background flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="bg-primary/10 rounded-full p-3">
                  <Globe className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multiple Languages</h3>
                <p className="text-muted-foreground text-center">
                  Practice in English, Spanish, French, and many more languages.
                </p>
              </div>
              <div className="bg-background flex flex-col items-center space-y-2 rounded-lg border p-6">
                <div className="bg-primary/10 rounded-full p-3">
                  <Headphones className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Interactive Learning</h3>
                <p className="text-muted-foreground text-center">
                  Fill in missing lyrics to improve listening and comprehension
                  skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
