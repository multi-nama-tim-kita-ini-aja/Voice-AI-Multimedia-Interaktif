export interface OptionItem {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: OptionItem[];
  correctKey: "A" | "B" | "C" | "D";
  points: number;
}

export const QUIZ_QUESTIONS: Record<
  string,
  Record<string, MultipleChoiceQuestion[]>
> = {
  mtk: {
    "1": [
      {
        id: "mtk-1-1",
        question: "Berapakah hasil dari 15 dikalikan 8?",
        options: [
          { key: "A", text: "110" },
          { key: "B", text: "120" },
          { key: "C", text: "130" },
          { key: "D", text: "140" },
        ],
        correctKey: "B",
        points: 10,
      },
      {
        id: "mtk-1-2",
        question:
          "Jika sebuah segitiga memiliki alas 10 cm dan tinggi 6 cm, berapakah luasnya?",
        options: [
          { key: "A", text: "30 sentimeter persegi" },
          { key: "B", text: "60 sentimeter persegi" },
          { key: "C", text: "25 sentimeter persegi" },
          { key: "D", text: "16 sentimeter persegi" },
        ],
        correctKey: "A",
        points: 10,
      },
    ],
    "2": [
      {
        id: "mtk-2-1",
        question:
          "Manakah di antara bilangan berikut yang merupakan bilangan prima?",
        options: [
          { key: "A", text: "21" },
          { key: "B", text: "27" },
          { key: "C", text: "29" },
          { key: "D", text: "33" },
        ],
        correctKey: "C",
        points: 10,
      },
    ],
    "3": [
      {
        id: "mtk-3-1",
        question:
          "Pada segitiga siku-siku dengan sisi 3 cm dan 4 cm, berapakah panjang sisi miringnya?",
        options: [
          { key: "A", text: "5 sentimeter" },
          { key: "B", text: "6 sentimeter" },
          { key: "C", text: "7 sentimeter" },
          { key: "D", text: "8 sentimeter" },
        ],
        correctKey: "A",
        points: 10,
      },
    ],
  },
  ipa: {
    "1": [
      {
        id: "ipa-1-1",
        question:
          "Planet apakah yang paling dekat dengan Matahari di tata surya kita?",
        options: [
          { key: "A", text: "Venus" },
          { key: "B", text: "Mars" },
          { key: "C", text: "Merkurius" },
          { key: "D", text: "Bumi" },
        ],
        correctKey: "C",
        points: 10,
      },
    ],
    "2": [
      {
        id: "ipa-2-1",
        question:
          "Gas apakah yang dilepaskan oleh tumbuhan selama proses fotosintesis?",
        options: [
          { key: "A", text: "Karbon dioksida" },
          { key: "B", text: "Oksigen" },
          { key: "C", text: "Nitrogen" },
          { key: "D", text: "Metana" },
        ],
        correctKey: "B",
        points: 10,
      },
    ],
    "3": [
      {
        id: "ipa-3-1",
        question:
          "Hukum Newton berapakah yang menyatakan konsep aksi dan reaksi?",
        options: [
          { key: "A", text: "Hukum Newton Pertama" },
          { key: "B", text: "Hukum Newton Kedua" },
          { key: "C", text: "Hukum Newton Ketiga" },
          { key: "D", text: "Hukum Gravitasi Umum" },
        ],
        correctKey: "C",
        points: 10,
      },
    ],
  },
  ips: {
    "1": [
      {
        id: "ips-1-1",
        question: "Monumen Nasional atau Monas terletak di kota mana?",
        options: [
          { key: "A", text: "Bandung" },
          { key: "B", text: "Surabaya" },
          { key: "C", text: "Yogyakarta" },
          { key: "D", text: "Jakarta" },
        ],
        correctKey: "D",
        points: 10,
      },
    ],
    "2": [
      {
        id: "ips-2-1",
        question:
          "Pada tanggal berapakah Proklamasi Kemerdekaan Indonesia dibacakan?",
        options: [
          { key: "A", text: "17 Agustus 1945" },
          { key: "B", text: "1 Juni 1945" },
          { key: "C", text: "28 Oktober 1928" },
          { key: "D", text: "20 Mei 1908" },
        ],
        correctKey: "A",
        points: 10,
      },
    ],
    "3": [
      {
        id: "ips-3-1",
        question:
          "Kenaikan harga barang dan jasa secara terus menerus disebut dengan apa?",
        options: [
          { key: "A", text: "Deflasi" },
          { key: "B", text: "Inflasi" },
          { key: "C", text: "Devaluasi" },
          { key: "D", text: "Resesi" },
        ],
        correctKey: "B",
        points: 10,
      },
    ],
  },
};
