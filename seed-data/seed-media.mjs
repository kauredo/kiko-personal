#!/usr/bin/env node
/**
 * Uploads curated Instagram media to Convex storage and inserts media records.
 *
 * Usage:
 *   node seed-data/seed-media.mjs
 *
 * Reads VITE_CONVEX_URL from .env.local. Logs in as the seed admin user.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IG_DIR = path.join(__dirname, "francisco.catarro");
const TAGGED_DIR = path.join(__dirname, "francisco.catarro_tagged");

// ── Curated photos ─────────────────────────────────────────────────────────

const photos = [
  {
    file: "2022-10-26_CkL3immIrrQ_1.jpg",
    title: "Francisco Catarro",
    caption: "Live with Kevin Davy White. Budapest, 2022.",
    category: "portrait",
    featured: true,
    useAsProfilePhoto: true,
  },
  {
    file: "2022-07-24_CgZ_FyNoASZ_1.jpg",
    title: "Scarborough Open Air Theatre",
    caption: "Opening for Westlife with Kevin Davy White. Scarborough, 2022.",
    category: "live",
    featured: true,
  },
  {
    file: "2023-06-19_Ctre6Q5oPcY_1.jpg",
    title: "Hungary Festival",
    caption: "Festival in Hungary with Kevin Davy White, 2023.",
    category: "live",
    featured: true,
  },
  {
    file: "2022-09-27_CjBI-3xIH_S_1.jpg",
    title: "Festival Iminente, Lisbon",
    caption:
      "Playing at home with Carla Prata. Festival Iminente, Lisbon 2022.",
    category: "live",
    featured: true,
  },
  {
    file: "2023-04-23_CrYvizXI5oj.jpg",
    title: "Carla Prata Live, London",
    caption: "On stage with Carla Prata. London, 2023.",
    category: "live",
    featured: false,
  },
  {
    file: "2021-06-07_CP1NWF_Bwps.jpg",
    title: "Don Gabriel, East London",
    caption: "Live with Don Gabriel. East London, 2021.",
    category: "live",
    featured: false,
  },
  {
    file: "2022-05-17_CdqE2S8I7Qc_1.jpg",
    title: "The Great Escape Festival",
    caption: "The Great Escape Festival, Brighton 2022.",
    category: "live",
    featured: false,
  },
  {
    file: "2023-03-06_CpdWm0dIwyk.jpg",
    title: "Carla Prata, Bermondsey Social Club",
    caption:
      "Promo for Carla Prata live at Bermondsey Social Club. London, 2023.",
    category: "live",
    featured: false,
  },
  {
    file: "2023-02-07_CoXXVfyoiyb.jpg",
    title: "The Half Moon, London",
    caption: "Session night at The Half Moon. London, 2023.",
    category: "live",
    featured: false,
  },
  {
    file: "2021-07-24_CRuDgZWBaj0.jpg",
    title: "Recording Session",
    caption: "Acoustic recording session at the studio, 2021.",
    category: "studio",
    featured: true,
  },
  {
    file: "2020-10-16_CGaXkTQBXh7.jpg",
    title: "Bass Session",
    caption: "Bass practice, 2020.",
    category: "studio",
    featured: false,
  },
  {
    file: "2019-05-31_ByIX8T4ndPT.jpg",
    title: "Charvel Guitar",
    caption: "Guitar in the garden.",
    category: "portrait",
    featured: false,
  },
  {
    file: "2020-03-10_B9kRe9Pp-l5.jpg",
    title: "Tabora Live",
    caption: "Live with Tabora. New single 'Burn' release night, 2020.",
    category: "live",
    featured: false,
  },
  {
    file: "2019-09-08_B2J2jQsHnvZ.jpg",
    title: "Practice Session",
    caption: "Guitar practice outdoors.",
    category: "portrait",
    featured: false,
  },
  {
    file: "2019-12-12_B5_GI7HJ7Ck.jpg",
    title: "Portuguese Coast",
    caption: "By the sea in Portugal.",
    category: "portrait",
    featured: false,
  },
  {
    file: "2020-04-12_B-5KEDTpePq.jpg",
    title: "Charvel Close-up",
    caption: "Charvel guitar detail shot.",
    category: "gear",
    featured: false,
  },
  {
    file: "2023-07-06_CuXQARio5Nf.jpg",
    title: "Live Session, London",
    caption: "Solo performance, London 2023.",
    category: "live",
    featured: false,
  },
  // ── Tagged photos (from other artists' posts) ──
  {
    file: "tagged/2022-09-26_Ci-5ooTL2Qi_2.jpg",
    title: "Carla Prata, Festival Iminente",
    caption: "On stage with Carla Prata at Festival Iminente. Pro shot by Miguel Chocobai. Lisbon, 2022.",
    category: "live",
    featured: true,
  },
  {
    file: "tagged/2022-09-26_Ci-5ooTL2Qi_6.jpg",
    title: "Festival Iminente — Full Stage",
    caption: "Carla Prata set at Festival Iminente. Lisbon, 2022.",
    category: "live",
    featured: false,
  },
  {
    file: "tagged/2022-09-24_Ci5Ne39MVld_1.jpg",
    title: "Keys at Festival Iminente",
    caption: "Playing keys with Carla Prata at Festival Iminente. Lisbon, 2022.",
    category: "live",
    featured: true,
  },
  {
    file: "tagged/2022-09-24_Ci5Ne39MVld_5.jpg",
    title: "Carla Prata Band — Iminente Crowd",
    caption: "Band selfie with the crowd at Festival Iminente. Lisbon, 2022.",
    category: "live",
    featured: true,
  },
  {
    file: "tagged/2024-12-30_DENcluEtik2_2.jpg",
    title: "Marta Per, Jazz Cafe",
    caption: "Acoustic set with Marta Per at the Jazz Cafe. London, 2024.",
    category: "live",
    featured: true,
  },
  {
    file: "tagged/2023-11-02_CzJ6Qu2NK0x_1.jpg",
    title: "Marta Per, The Half Moon",
    caption: "Live with Marta Per at The Half Moon. London, 2023.",
    category: "live",
    featured: false,
  },
  {
    file: "tagged/2023-06-18_CtpDQDJI7Lw_1.jpg",
    title: "Hungary Festival — Sunset",
    caption: "Band photo at sunset. Hungary Festival with Kevin Davy White, 2023.",
    category: "live",
    featured: true,
  },
  {
    file: "tagged/2022-11-14_Ck8cmm5KET-_1.jpg",
    title: "Saint Air Live",
    caption: "Live with Saint Air. London, 2022.",
    category: "live",
    featured: false,
  },
  {
    file: "tagged/2025-07-12_DMBGh07sIrQ_3.jpg",
    title: "Storry Festival — Piano",
    caption: "Playing grand piano with Storry at a festival, 2025.",
    category: "live",
    featured: true,
  },
  {
    file: "tagged/2023-06-20_Ctt0IIeNWgP.jpg",
    title: "Marta Per, The Troubadour",
    caption: "Acoustic duo with Marta Per at The Troubadour. London, 2023.",
    category: "live",
    featured: false,
  },
  {
    file: "tagged/2023-07-04_CuRfRt1tr6u_2.jpg",
    title: "Kevin Davy White Band",
    caption: "With Kevin Davy White's band backstage at a festival, 2023.",
    category: "live",
    featured: false,
  },
];

// ── Curated videos ─────────────────────────────────────────────────────────

const videos = [
  {
    file: "2023-04-13_Cq_AbAGISFd.mp4",
    title: "Until I Found You — Stephen Sanchez (Cover)",
    description:
      "Guitar cover of Stephen Sanchez's 'Until I Found You'. Gibson Les Paul + Neural DSP.",
    category: "cover",
    featured: true,
  },
  {
    file: "2022-11-19_ClJ1y9ZIsMz.mp4",
    title: "Music Store Jam",
    description:
      "Spontaneous jam at a music store in Denmark Street, London. Keys + a very musical stranger.",
    category: "original",
    featured: true,
  },
  {
    file: "2022-09-20_CivUcXMI3p7.mp4",
    title: "Carla Prata — Festival Iminente Promo",
    description:
      "Promo clip for Carla Prata at Festival Iminente, Lisbon 2022.",
    category: "live",
    featured: true,
  },
  {
    file: "2021-03-15_CMccASEB9IL.mp4",
    title: "True Colors — Cyndi Lauper (Cover)",
    description:
      "Guitar cover of Cyndi Lauper's 'True Colors'. Charvel + Neural DSP.",
    category: "cover",
    featured: false,
  },
  {
    file: "2020-12-25_CJPERrdBwG4.mp4",
    title: "Fix You — Coldplay (Cover)",
    description: "Christmas guitar cover of Coldplay's 'Fix You'.",
    category: "cover",
    featured: false,
  },
  {
    file: "2020-02-22_B84PpPmn-8u.mp4",
    title: "Your Latest Tricks — Dire Straits (Cover)",
    description:
      "Guitar cover of Dire Straits' 'Your Latest Tricks' intro.",
    category: "cover",
    featured: false,
  },
  {
    file: "2019-10-17_B3u5aMSJt0L.mp4",
    title: "Get The Funk Out — Extreme (Cover)",
    description:
      "Guitar solo cover of Extreme's 'Get The Funk Out'. One of his all-time favourite solos.",
    category: "cover",
    featured: true,
  },
  {
    file: "2020-10-24_CGu-okehiLk.mp4",
    title: "Original Piece",
    description:
      "Original guitar composition. Charvel + Neural DSP + Music Man.",
    category: "original",
    featured: true,
  },
];

// ── Resolve Convex URL ─────────────────────────────────────────────────────

function getConvexUrl() {
  if (process.env.CONVEX_URL) return process.env.CONVEX_URL;
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const match = fs.readFileSync(envPath, "utf-8").match(/VITE_CONVEX_URL=(.+)/);
    if (match) return match[1].trim();
  }
  throw new Error("Set CONVEX_URL or ensure .env.local has VITE_CONVEX_URL");
}

const client = new ConvexHttpClient(getConvexUrl());

// ── Helpers ────────────────────────────────────────────────────────────────

async function login() {
  const { token } = await client.mutation(api.auth.login, {
    email: "admin@franciscocatarro.com",
    password: "changeme123",
  });
  return token;
}

async function uploadFile(token, filePath) {
  const uploadUrl = await client.mutation(api.storage.generateUploadUrl, {
    token,
  });
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".mp4"
        ? "video/mp4"
        : "application/octet-stream";

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": mimeType },
    body: fileBuffer,
  });

  if (!res.ok)
    throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  const { storageId } = await res.json();
  return storageId;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("Logging in as admin...");
  const token = await login();
  console.log("Authenticated.\n");

  // Photos
  let photoCount = 0;
  for (const photo of photos) {
    const filePath = photo.file.startsWith("tagged/")
      ? path.join(TAGGED_DIR, photo.file.replace("tagged/", ""))
      : path.join(IG_DIR, photo.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP (missing): ${photo.file}`);
      continue;
    }

    process.stdout.write(`  Photo: ${photo.title}...`);
    const storageId = await uploadFile(token, filePath);
    await client.mutation(api.media.create, {
      token,
      type: "photo",
      title: photo.title,
      description: photo.caption,
      category: photo.category,
      featured: photo.featured,
      imageFile: storageId,
      caption: photo.caption,
    });

    // Set as bio profile photo if flagged
    if (photo.useAsProfilePhoto) {
      const profileStorageId = await uploadFile(token, filePath);
      const bio = await client.query(api.bio.get);
      if (bio) {
        await client.mutation(api.bio.upsert, {
          token,
          name: bio.name,
          title: bio.title,
          content: bio.content,
          socialLinks: bio.socialLinks,
          profilePhoto: profileStorageId,
        });
      }
      console.log(" ok (+ set as profile photo)");
    } else {
      console.log(" ok");
    }
    photoCount++;
  }

  console.log(`\n  ${photoCount} photos uploaded.\n`);

  // Videos — upload file to storage, store as video type with imageFile
  let videoCount = 0;
  for (const video of videos) {
    const filePath = path.join(IG_DIR, video.file);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP (missing): ${video.file}`);
      continue;
    }

    process.stdout.write(`  Video: ${video.title}...`);
    const storageId = await uploadFile(token, filePath);
    await client.mutation(api.media.create, {
      token,
      type: "video",
      title: video.title,
      description: video.description,
      category: video.category,
      featured: video.featured,
      imageFile: storageId,
    });
    console.log(" ok");
    videoCount++;
  }

  console.log(`\n  ${videoCount} videos uploaded.`);
  console.log(`\nDone! ${photoCount} photos + ${videoCount} videos seeded.`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
