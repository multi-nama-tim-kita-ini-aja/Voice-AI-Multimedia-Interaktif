
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

type AnswerKey = "A" | "B" | "C" | "D";

function q(
  id: string,
  question: string,
  A: string,
  B: string,
  C: string,
  D: string,
  correctKey: AnswerKey
): MultipleChoiceQuestion {
  return {
    id,
    question,
    options: [
      { key: "A", text: A },
      { key: "B", text: B },
      { key: "C", text: C },
      { key: "D", text: D },
    ],
    correctKey,
    points: 10,
  };
}

export const QUIZ_QUESTIONS: Record<
  string,
  Record<string, MultipleChoiceQuestion[]>
> = {
  // ==========================================
  // MATEMATIKA
  // ==========================================
  mtk: {
    // LEVEL 1 - EASY (8 SOAL)
    "1": [
      q("mtk-1-1", "Berapakah hasil dari 15 dikalikan 8?", "110", "120", "130", "140", "B"),
      q("mtk-1-2", "Segitiga memiliki alas 10 cm dan tinggi 6 cm. Berapakah luasnya?", "30 cm²", "60 cm²", "25 cm²", "16 cm²", "A"),
      q("mtk-1-3", "Berapakah hasil dari 25 + 17?", "32", "42", "52", "43", "B"),
      q("mtk-1-4", "Berapakah hasil dari 9 × 7?", "56", "63", "72", "69", "B"),
      q("mtk-1-5", "Berapakah hasil dari 100 - 36?", "54", "64", "74", "66", "B"),
      q("mtk-1-6", "Berapakah hasil dari 144 ÷ 12?", "10", "11", "12", "14", "C"),
      q("mtk-1-7", "Berapakah hasil dari 8²?", "16", "32", "64", "72", "C"),
      q("mtk-1-8", "Persegi memiliki sisi 9 cm. Berapakah kelilingnya?", "18 cm", "27 cm", "36 cm", "81 cm", "C"),
    ],

    // LEVEL 2 - MEDIUM (10 SOAL)
    "2": [
      q("mtk-2-1", "Manakah bilangan prima berikut?", "21", "27", "29", "33", "C"),
      q("mtk-2-2", "Berapakah 15% dari 200?", "20", "25", "30", "35", "C"),
      q("mtk-2-3", "Jika 3x + 5 = 20, berapakah x?", "3", "5", "7", "10", "B"),
      q("mtk-2-4", "Berapakah rata-rata 6, 8, 10, 12, dan 14?", "8", "9", "10", "12", "C"),
      q("mtk-2-5", "Berapakah hasil dari 2/3 + 1/6?", "1/2", "5/6", "1", "7/6", "B"),
      q("mtk-2-6", "Panjang persegi panjang 12 cm dan lebar 5 cm. Berapakah luasnya?", "17 cm²", "34 cm²", "60 cm²", "120 cm²", "C"),
      q("mtk-2-7", "Jika 2x - 7 = 15, berapakah x?", "4", "8", "11", "15", "C"),
      q("mtk-2-8", "Perbandingan dua bilangan adalah 2:3. Jika jumlahnya 25, bilangan yang lebih besar adalah...", "10", "12", "15", "20", "C"),
      q("mtk-2-9", "Sebuah barang seharga Rp80.000 didiskon 10%. Berapa harga akhirnya?", "Rp70.000", "Rp72.000", "Rp74.000", "Rp78.000", "B"),
      q("mtk-2-10", "Berapakah KPK dari 6 dan 8?", "12", "18", "24", "48", "C"),
    ],

    // LEVEL 3 - HARD (12 SOAL)
    "3": [
      q("mtk-3-1", "Segitiga siku-siku memiliki sisi 3 cm dan 4 cm. Berapakah sisi miringnya?", "5 cm", "6 cm", "7 cm", "8 cm", "A"),
      q("mtk-3-2", "Berapakah akar kuadrat dari 225?", "12", "13", "15", "25", "C"),
      q("mtk-3-3", "Barang seharga Rp200.000 mendapat diskon 25%. Berapa harga akhirnya?", "Rp125.000", "Rp150.000", "Rp175.000", "Rp180.000", "B"),
      q("mtk-3-4", "Jika x² = 81 dan x positif, berapakah x?", "7", "8", "9", "18", "C"),
      q("mtk-3-5", "Jika f(x) = 2x² - 3, berapakah f(3)?", "9", "12", "15", "18", "C"),
      q("mtk-3-6", "Berapakah jumlah 5 suku pertama deret 2, 4, 6, 8, ...?", "20", "25", "30", "35", "C"),
      q("mtk-3-7", "Lingkaran berjari-jari 7 cm. Berapakah luasnya jika π = 22/7?", "44 cm²", "154 cm²", "308 cm²", "616 cm²", "B"),
      q("mtk-3-8", "Jika 2x + 3 = 17, berapakah nilai x?", "5", "6", "7", "8", "C"),
      q("mtk-3-9", "Berapakah median dari data 3, 7, 8, 10, 12, 15, 20?", "8", "9", "10", "12", "C"),
      q("mtk-3-10", "Peluang muncul angka genap saat melempar satu dadu adalah...", "1/6", "1/3", "1/2", "2/3", "C"),
      q("mtk-3-11", "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm. Berapakah volumenya jika π = 22/7?", "770 cm³", "1.100 cm³", "1.540 cm³", "3.080 cm³", "C"),
      q("mtk-3-12", "Jika 3(x - 2) = 2x + 5, berapakah x?", "7", "9", "11", "13", "C"),
    ],

  },

  // ==========================================
  // IPA
  // ==========================================
  ipa: {
    // LEVEL 1 - EASY (8 SOAL)
    "1": [
      q("ipa-1-1", "Planet yang paling dekat dengan Matahari adalah...", "Venus", "Mars", "Merkurius", "Bumi", "C"),
      q("ipa-1-2", "Organ tubuh yang memompa darah adalah...", "Paru-paru", "Jantung", "Lambung", "Ginjal", "B"),
      q("ipa-1-3", "Air membeku pada suhu berapa dalam tekanan normal?", "0°C", "10°C", "50°C", "100°C", "A"),
      q("ipa-1-4", "Sumber energi utama bagi Bumi adalah...", "Bulan", "Angin", "Matahari", "Batu bara", "C"),
      q("ipa-1-5", "Bagian tumbuhan yang menyerap air dan mineral adalah...", "Daun", "Bunga", "Akar", "Buah", "C"),
      q("ipa-1-6", "Hewan yang berkembang biak dengan bertelur disebut...", "Vivipar", "Ovipar", "Mamalia", "Herbivor", "B"),
      q("ipa-1-7", "Alat untuk mengukur suhu adalah...", "Barometer", "Termometer", "Higrometer", "Speedometer", "B"),
      q("ipa-1-8", "Gas yang dibutuhkan manusia untuk bernapas adalah...", "Nitrogen", "Oksigen", "Helium", "Metana", "B"),
    ],

    // LEVEL 2 - MEDIUM (10 SOAL)
    "2": [
      q("ipa-2-1", "Gas yang dilepaskan tumbuhan saat fotosintesis adalah...", "Karbon dioksida", "Oksigen", "Nitrogen", "Metana", "B"),
      q("ipa-2-2", "Organel tempat utama fotosintesis adalah...", "Mitokondria", "Kloroplas", "Ribosom", "Nukleus", "B"),
      q("ipa-2-3", "Satuan gaya dalam Sistem Internasional adalah...", "Joule", "Watt", "Newton", "Pascal", "C"),
      q("ipa-2-4", "Perubahan wujud gas menjadi cair disebut...", "Menguap", "Menyublim", "Membeku", "Mengembun", "D"),
      q("ipa-2-5", "Hukum Newton tentang aksi dan reaksi adalah hukum ke...", "Satu", "Dua", "Tiga", "Empat", "C"),
      q("ipa-2-6", "Pembuluh darah yang membawa darah keluar dari jantung adalah...", "Vena", "Arteri", "Kapiler", "Alveolus", "B"),
      q("ipa-2-7", "Perubahan energi listrik menjadi cahaya terjadi pada...", "Lampu menyala", "Batu jatuh", "Es mencair", "Air mengalir", "A"),
      q("ipa-2-8", "Lapisan atmosfer tempat sebagian besar cuaca terjadi adalah...", "Stratosfer", "Mesosfer", "Troposfer", "Termosfer", "C"),
      q("ipa-2-9", "Hubungan antara tegangan, arus, dan hambatan dikenal sebagai hukum...", "Newton", "Ohm", "Archimedes", "Pascal", "B"),
      q("ipa-2-10", "Organ utama sistem pernapasan manusia adalah...", "Hati", "Paru-paru", "Ginjal", "Pankreas", "B"),
    ],

    // LEVEL 3 - HARD (12 SOAL)
    "3": [
      q("ipa-3-1", "Sebuah benda bermassa 4 kg mengalami percepatan 3 m/s². Berapa gaya resultannya?", "7 N", "12 N", "16 N", "24 N", "B"),
      q("ipa-3-2", "Hambatan 4 ohm dialiri arus 3 ampere. Berapa tegangannya?", "7 V", "8 V", "12 V", "16 V", "C"),
      q("ipa-3-3", "Dalam rantai makanan rumput → belalang → katak → ular, konsumen tingkat kedua adalah...", "Rumput", "Belalang", "Katak", "Ular", "C"),
      q("ipa-3-4", "Benda bergerak dengan kecepatan tetap 20 m/s selama 5 sekon. Berapa jaraknya?", "25 m", "50 m", "100 m", "200 m", "C"),
      q("ipa-3-5", "Organel yang berperan utama menghasilkan ATP melalui respirasi sel adalah...", "Lisosom", "Mitokondria", "Badan Golgi", "Sentriol", "B"),
      q("ipa-3-6", "Jika tegangan 24 V dan hambatan 8 ohm, berapa kuat arusnya?", "2 A", "3 A", "4 A", "6 A", "B"),
      q("ipa-3-7", "Benda bermassa 2 kg bergerak dengan kecepatan 5 m/s. Berapakah energi kinetiknya?", "10 J", "20 J", "25 J", "50 J", "C"),
      q("ipa-3-8", "Jika frekuensi gelombang 5 Hz dan panjang gelombangnya 4 m, berapa cepat rambatnya?", "1,25 m/s", "9 m/s", "20 m/s", "25 m/s", "C"),
      q("ipa-3-9", "Persilangan Aa × Aa menghasilkan peluang keturunan bergenotipe aa sebesar...", "0%", "25%", "50%", "75%", "B"),
      q("ipa-3-10", "Larutan dengan pH 3 bersifat...", "Asam", "Netral", "Basa", "Garam murni", "A"),
      q("ipa-3-11", "Sebuah benda memiliki massa 200 gram dan volume 50 cm³. Berapa massa jenisnya?", "2 g/cm³", "4 g/cm³", "5 g/cm³", "10 g/cm³", "B"),
      q("ipa-3-12", "Sebuah hambatan 6 ohm dihubungkan dengan tegangan 12 V. Berapa daya listriknya?", "12 W", "18 W", "24 W", "36 W", "C"),
    ],
  },

  // ==========================================
  // IPS
  // ==========================================
  ips: {
    // LEVEL 1 - EASY (8 SOAL)
    "1": [
      q("ips-1-1", "Monumen Nasional atau Monas terletak di kota...", "Bandung", "Surabaya", "Yogyakarta", "Jakarta", "D"),
      q("ips-1-2", "Apa mata uang resmi Indonesia?", "Ringgit", "Rupiah", "Baht", "Peso", "B"),
      q("ips-1-3", "Indonesia memproklamasikan kemerdekaan pada tahun...", "1908", "1928", "1945", "1950", "C"),
      q("ips-1-4", "Membeli barang dari luar negeri disebut...", "Ekspor", "Impor", "Produksi", "Distribusi", "B"),
      q("ips-1-5", "Kegiatan menghasilkan barang atau jasa disebut...", "Konsumsi", "Produksi", "Distribusi", "Impor", "B"),
      q("ips-1-6", "Candi Borobudur terletak di provinsi...", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "Banten", "C"),
      q("ips-1-7", "Kegiatan menggunakan barang atau jasa disebut...", "Produksi", "Distribusi", "Konsumsi", "Ekspor", "C"),
      q("ips-1-8", "Bendera negara Indonesia berwarna...", "Merah dan putih", "Biru dan putih", "Merah dan kuning", "Hijau dan putih", "A"),
    ],

    // LEVEL 2 - MEDIUM (10 SOAL)
    "2": [
      q("ips-2-1", "Pada tanggal berapakah Proklamasi Kemerdekaan Indonesia dibacakan?", "17 Agustus 1945", "1 Juni 1945", "28 Oktober 1928", "20 Mei 1908", "A"),
      q("ips-2-2", "ASEAN didirikan pada tanggal...", "8 Agustus 1967", "17 Agustus 1945", "1 Juni 1945", "28 Oktober 1928", "A"),
      q("ips-2-3", "Menyalurkan barang dari produsen kepada konsumen disebut...", "Konsumsi", "Produksi", "Distribusi", "Investasi", "C"),
      q("ips-2-4", "Garis khayal yang membagi Bumi menjadi belahan utara dan selatan adalah...", "Garis bujur utama", "Garis khatulistiwa", "Garis tanggal internasional", "Garis balik utara", "B"),
      q("ips-2-5", "Perpindahan penduduk dari desa menuju kota disebut...", "Transmigrasi", "Urbanisasi", "Imigrasi", "Emigrasi", "B"),
      q("ips-2-6", "Organisasi kerja sama negara-negara Asia Tenggara adalah...", "ASEAN", "NATO", "OPEC", "OECD", "A"),
      q("ips-2-7", "Kelangkaan ekonomi terjadi karena...", "Kebutuhan terbatas dan sumber daya tak terbatas", "Semua barang gratis", "Kebutuhan tidak terbatas, sumber daya terbatas", "Tidak ada kebutuhan manusia", "C"),
      q("ips-2-8", "Kegiatan menjual barang ke luar negeri disebut...", "Impor", "Ekspor", "Konsumsi", "Distribusi lokal", "B"),
      q("ips-2-9", "Lembaga yang bertugas menjaga kestabilan nilai rupiah dan menjalankan kebijakan moneter Indonesia adalah...", "Bank Indonesia", "Kementerian Pendidikan", "Mahkamah Agung", "Badan Pusat Statistik", "A"),
      q("ips-2-10", "Keadaan ketika harga barang dan jasa naik secara umum dan terus-menerus disebut...", "Deflasi", "Inflasi", "Resesi", "Devaluasi", "B"),
    ],

    // LEVEL 3 - HARD (12 SOAL)
    "3": [
      q("ips-3-1", "Kenaikan harga barang dan jasa secara terus-menerus disebut...", "Deflasi", "Inflasi", "Devaluasi", "Resesi", "B"),
      q("ips-3-2", "Jika permintaan meningkat sementara penawaran tetap, harga cenderung...", "Turun", "Naik", "Tetap selamanya", "Menjadi nol", "B"),
      q("ips-3-3", "Tujuan utama kebijakan fiskal adalah...", "Mengatur penerimaan dan pengeluaran pemerintah", "Menentukan semua harga secara langsung", "Menghapus perdagangan", "Menggantikan semua peran bank", "A"),
      q("ips-3-4", "Interaksi antarruang terjadi karena wilayah memiliki...", "Sumber daya yang selalu sama", "Tidak membutuhkan wilayah lain", "Potensi dan kebutuhan yang berbeda", "Jumlah penduduk yang sama", "C"),
      q("ips-3-5", "Kebijakan bank sentral untuk memengaruhi jumlah uang beredar disebut kebijakan...", "Fiskal", "Moneter", "Perdagangan", "Industri", "B"),
      q("ips-3-6", "Salah satu dampak positif perdagangan internasional adalah...", "Mempersempit pilihan barang", "Menghilangkan seluruh persaingan", "Memperluas pasar produk dalam negeri", "Menghentikan pertukaran teknologi", "C"),
      q("ips-3-7", "Pembangunan berkelanjutan bertujuan memenuhi kebutuhan sekarang tanpa...", "Menggunakan teknologi", "Mengabaikan kebutuhan generasi mendatang", "Meningkatkan pendidikan", "Melakukan perdagangan", "B"),
      q("ips-3-8", "Jika nilai rupiah melemah terhadap dolar AS, barang impor yang dibayar dalam dolar cenderung menjadi...", "Lebih murah dalam rupiah", "Lebih mahal dalam rupiah", "Selalu gratis", "Tidak memiliki harga", "B"),
      q("ips-3-9", "Pajak progresif adalah pajak yang tarifnya cenderung...", "Menurun saat dasar pengenaan naik", "Meningkat saat dasar pengenaan naik", "Selalu nol", "Sama dengan tarif bea impor", "B"),
      q("ips-3-10", "Biaya peluang dalam ekonomi adalah...", "Seluruh uang yang dimiliki", "Nilai alternatif terbaik yang dikorbankan", "Pajak yang dibayar perusahaan", "Keuntungan dari semua pilihan sekaligus", "B"),
      q("ips-3-11", "Salah satu tujuan utama diversifikasi ekonomi adalah...", "Bergantung pada satu sumber pendapatan", "Mengurangi ketergantungan pada satu sektor", "Menghentikan seluruh investasi", "Menghapus perdagangan antardaerah", "B"),
      q("ips-3-12", "Ketika pemerintah meningkatkan belanja infrastruktur, kebijakan tersebut termasuk kebijakan...", "Moneter", "Fiskal", "Nilai tukar", "Kependudukan", "B"),
    ],
  },
};
