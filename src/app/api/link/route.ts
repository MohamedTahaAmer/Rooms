import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const href = url.searchParams.get("url");

    if (!href) {
      return NextResponse.json({ message: "Invalid href" }, { status: 400 });
    }

    const { data } = await axios.get(href);

    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";

    const descriptionMatch = data.match(
      /<meta name="description" content="(.*?)"/
    );
    const description = descriptionMatch ? descriptionMatch[1] : "";

    const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);
    const imageUrl = imageMatch ? imageMatch[1] : "";

    return NextResponse.json({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      const message = err.message;
      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message:
          "There was an error fetching the data for the provided website.",
      },
      { status: 500 }
    );
  }
}
