function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
    );
    }
    
    export async function GET() {
    const URL = process.env.NEXT_PUBLIC_URL as string;
    return Response.json({
        "accountAssociation": {  // these will be added in step 5
          "header": "",
          "payload": "",
          "signature": ""
        },
        "baseBuilder": {
          "ownerAddress": "0x1615Ad56c1F19B2394cf36496F99A29D4E21932A" // add your Base Account address here
        },
        "miniapp": {
          "version": "1",
          "name": "Example Mini App",
          "homeUrl": "https://ex.co",
          "iconUrl": "https://ex.co/i.png",
          "splashImageUrl": "https://ex.co/l.png",
          "splashBackgroundColor": "#000000",
          "webhookUrl": "https://ex.co/api/webhook",
          "subtitle": "Fast, fun, social",
          "description": "A fast, fun way to challenge friends in real time.",
          "screenshotUrls": [
            "https://ex.co/s1.png",
            "https://ex.co/s2.png",
            "https://ex.co/s3.png"
          ],
          "primaryCategory": "social",
          "tags": ["example", "miniapp", "baseapp"],
          "heroImageUrl": "https://ex.co/og.png",
          "tagline": "Play instantly",
          "ogTitle": "Example Mini App",
          "ogDescription": "Challenge friends in real time.",
          "ogImageUrl": "https://ex.co/og.png",
          "noindex": true
        }
      }); // see the next step for the manifest_json_object
    }



/*function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}



export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    baseBuilder: {
      allowedAddresses: [""] // TODO: Add your Base Account address here
    },
    miniapp: {
      version: "1",
      name: "Kiniela",
      homeUrl: `${URL}`,
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "Prediction Markets",
      description: "A fast, fun way to create and bet on prediction markets on Base.",
      screenshotUrls: [
        `${URL}/screenshot1.png`,
        `${URL}/screenshot2.png`,
        `${URL}/screenshot3.png`
      ],
      primaryCategory: "social",
      tags: ["prediction", "markets", "base", "betting", "social"],
      heroImageUrl: `${URL}/og-image.png`,
      tagline: "Bet on anything",
      ogTitle: "Kiniela - Prediction Markets on Base",
      ogDescription: "Create and bet on prediction markets with friends on Base.",
      ogImageUrl: `${URL}/og-image.png`,
      noindex: false
    }
  };

  return Response.json(withValidProperties(manifest));
}
*/