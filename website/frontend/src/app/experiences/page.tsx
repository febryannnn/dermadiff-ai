import type { Metadata } from "next";
import Image from "next/image";
import { Quotes } from "@phosphor-icons/react/dist/ssr/Quotes";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "User Experiences",
  description:
    "What clinicians who have tried DermaDiff say about reading dermoscopic lesions with it.",
};

const FEATURED_YOUTUBE_ID = "i5mcehWAuLo";

const FEATURED = {
  name: "dr.Regina, Sp.KK",
  role: "Dermatologist and Venereologist",
  photo: "/dr-regina.jpg",
  quote:
    "Produk ini sangat membantu para dokter dalam melakukan diagnosis terhadap jenis lesi kulit, ketepatan dari hasil prediksinya juga cukup baik bahkan juga disertai penjelasan mengapa AI mengklasifikasikan ke kelas kelas tersebut, hal ini membantu dokter karena terkadang dokterpun juga bisa saja mengalami kesulitan dan harus membaca-baca lagi terkait jenis jenis lesi kulit, dengan adanya AI ini sangat memudahkan, akan tetapi terkadang penjelasan yang diberikan terlalu panjang dan tidak to-the-point serta AI ini masih terbatas di beberapa jenis lesi saja sehingga akan sangat baik jika nanti bisa mengklasifikasikan ke jenis jenis kanker yang lain",
};

const PHOTO_FEATURED = {
  name: "dr. Lorettha Wijaya, Sp.KK",
  role: "Dermatologist and Venereologist",
  photo: "/foto-dr-lorettha.jpeg",
  bylinePhoto: "/dr-loreta.jpg",
  quote:
    "Produk ini bisa membantu bukan hanya dokter umum akan tetapi juga dokter spesialis kulit selama akurasinya tinggi, beberapa penjelasan yang diberikan dari AI nya juga sudah cukup baik dan menggunakan istilah istilah yang banyak digunakan di dermatologi, akan tetapi terkadang terdapat penjelasan yang cukup generik sehingga tidak terlalu menjelaskan secara spesifik mengapa AI memilih kelas kelas tertentu sebagai hasil prediksinya.",
};

const REVIEWS = [
  {
    name: "dr. Rina Munirah Bulqini, M.K.M, Sp.DVE",
    role: "Dermatologist and Venereologist",
    photo: "/dr-rina.jpeg",
    quote:
      "Menurut saya, aplikasi DermaDiff ini ke depannya akan jauh lebih aplikatif jika pengembangannya difokuskan agar bisa memproses foto dari kamera HP biasa, bukan hanya bergantung pada hasil dermoskopi. Di lapangan, ketersediaan alat dermoskopi itu sangat terbatas, apalagi di poli BPJS, RS tipe C, atau bahkan RS tipe B; tidak semua dokter Sp.DVE memilikinya karena harganya yang bervariasi. Jika bisa menggunakan kamera biasa, aplikasi ini tentu akan sangat memudahkan sasarannya, seperti peserta didik spesialis atau dokter yang berminat di sub-divisi tumor bedah kulit. Selain itu, saya melihat aplikasi ini belum menyertakan ABCD rule yang biasanya kami pakai sebagai standar pembacaan klinis, sehingga akan sangat baik jika parameter tersebut bisa diintegrasikan ke depannya.",
  },
  {
    name: "Zacky Anfasa Ahmad",
    role: "Mahasiswa Fakultas Kedokteran Universitas Brawijaya",
    photo: "/zacky-anfasa.JPG",
    quote:
      "Aplikasi ini memiliki potensi yang tinggi dalam membantu tenaga medis mengarah pada suatu diagnosis dermatologi, dengan prediksi yang saat ini sudah cukup akurat dan memiliki dasar yang jelas berdasarkan hasil analisis dermoskopinya sendiri. Ke depannya, pengembangan aplikasi dapat diarahkan untuk memperluas cakupan tumor dan keganasan yang tersedia, karena masih terdapat beberapa kemungkinan kanker lainnya yang belum sepenuhnya diperhitungkan. Selain itu, penggambaran heatmap masih perlu ditingkatkan agar dapat lebih konsisten dalam menandai lesi kulit yang sebenarnya, serta dikembangkan pula fitur lesion mark yang dapat memberikan penjelasan terhadap area lesi yang menjadi dasar prediksi. Beberapa kasus juga masih perlu diuji lebih lanjut, khususnya pada kasus seperti squamous cell carcinoma yang hasil pengujiannya belum diperoleh. Dengan pengembangan tersebut, diharapkan aplikasi ini dapat menjadi semakin terampil dan akurat dalam menentukan kemungkinan diagnosis, sekaligus menjadi media edukasi yang bermanfaat bagi calon tenaga medis di masa depan.",
  },
  {
    name: "Ahmad Faiz Annabih",
    role: "Mahasiswa Fakultas Kedokteran Universitas Airlangga",
    photo: "/faiz-annabih.JPG",
    quote:
      "Hal yang menurut saya menarik dari aplikasi ini adalah bagaimana hasil analisis dermoskopi dapat diterjemahkan menjadi suatu kemungkinan diagnosis yang cukup jelas. Dari beberapa hasil yang saya lihat, prediksinya sudah menunjukkan tingkat akurasi yang baik sehingga aplikasi ini berpotensi digunakan sebagai pendukung dalam proses pemeriksaan. Saya melihat pengembangan berikutnya bisa lebih diarahkan pada aspek interpretasi, terutama bagaimana aplikasi menjelaskan bagian lesi yang menjadi perhatian melalui lesion mark maupun visualisasi lainnya. Penambahan lebih banyak jenis keganasan kulit juga akan membuat hasil yang diberikan menjadi semakin menyeluruh. Jika aspek tersebut terus dikembangkan dan diuji pada kasus-kasus yang lebih beragam, saya rasa aplikasi ini juga dapat memberikan manfaat yang cukup besar sebagai sarana pembelajaran dermatologi.",
  },
];

function ByLine({
  name,
  role,
  photo,
}: {
  name: string;
  role: string;
  photo: string;
}) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-secondary">
        <Image src={photo} alt={name} fill sizes="36px" className="object-cover" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

export default function ExperiencesPage() {
  return (
    <div className="pt-12 pb-20 sm:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <div className="font-mono text-xs tracking-wide text-primary uppercase">
              User experiences
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Clinicians reading lesions with DermaDiff.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Early feedback from clinicians who used DermaDiff as a second
              opinion during dermoscopic review.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="dark mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground lg:grid-cols-2">
            <div className="aspect-video w-full border-b border-border bg-card lg:aspect-auto lg:border-r lg:border-b-0">
              <iframe
                className="size-full"
                src={`https://www.youtube.com/embed/${FEATURED_YOUTUBE_ID}`}
                title={`${FEATURED.name} full interview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10">
              <Quotes
                weight="fill"
                className="size-6 text-muted-foreground/40"
              />
              <p className="mt-3 text-lg leading-relaxed text-foreground">
                {FEATURED.quote}
              </p>
              <ByLine
                name={FEATURED.name}
                role={FEATURED.role}
                photo={FEATURED.photo}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="dark mt-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground lg:grid-cols-2">
            <div className="relative aspect-video w-full border-b border-border bg-card lg:aspect-auto lg:border-r lg:border-b-0">
              <Image
                src={PHOTO_FEATURED.photo}
                alt={PHOTO_FEATURED.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10">
              <Quotes
                weight="fill"
                className="size-6 text-muted-foreground/40"
              />
              <p className="mt-3 text-lg leading-relaxed text-foreground">
                {PHOTO_FEATURED.quote}
              </p>
              <ByLine
                name={PHOTO_FEATURED.name}
                role={PHOTO_FEATURED.role}
                photo={PHOTO_FEATURED.bylinePhoto}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-6 flex flex-col gap-4">
            {/* dr. Rina — full width */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <Quotes
                weight="fill"
                className="size-5 text-muted-foreground/30"
              />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                {REVIEWS[0].quote}
              </p>
              <ByLine
                name={REVIEWS[0].name}
                role={REVIEWS[0].role}
                photo={REVIEWS[0].photo}
              />
            </div>

            {/* Zacky & Faiz — 2 columns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {REVIEWS.slice(1).map((review) => (
                <div
                  key={review.name}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6"
                >
                  <Quotes
                    weight="fill"
                    className="size-5 text-muted-foreground/30"
                  />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                    {review.quote}
                  </p>
                  <ByLine
                    name={review.name}
                    role={review.role}
                    photo={review.photo}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}