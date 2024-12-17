const formatDate = (tanggal: string) => {
  // Array bulan dalam Bahasa Indonesia
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let day: number, month: number, year: number;

  if (tanggal.includes("/")) {
    // Format dd/mm/yyyy
    const [d, m, y] = tanggal.split("/");
    day = parseInt(d, 10);
    month = parseInt(m, 10) - 1; // Bulan dalam JavaScript dimulai dari 0
    year = parseInt(y, 10);
  } else {
    // Format yyyy-mm-dd
    const [y, m, d] = tanggal.split("-");
    day = parseInt(d, 10);
    month = parseInt(m, 10) - 1; // Bulan dalam JavaScript dimulai dari 0
    year = parseInt(y, 10);
  }

  // Mendapatkan nama bulan dari array bulanIndo
  const bulan = bulanIndo[month];

  // Mengembalikan format tanggal "1 Januari 2025"
  return `${day} ${bulan} ${year}`;
};

export default formatDate;
