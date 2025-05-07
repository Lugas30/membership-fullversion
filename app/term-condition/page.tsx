"use client";

export default function TermCondition() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="min-h-screen bg-white">
          <div className="flex flex-col bg-base-accent text-white rounded-b-3xl p-8">
            <div className="flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => window.history.back()}
                className="w-auto h-auto cursor-pointer absolute"
              >
                <path
                  d="M4 12L3.64645 11.6464L3.29289 12L3.64645 12.3536L4 12ZM19 12.5C19.2761 12.5 19.5 12.2761 19.5 12C19.5 11.7239 19.2761 11.5 19 11.5V12.5ZM9.64645 5.64645L3.64645 11.6464L4.35355 12.3536L10.3536 6.35355L9.64645 5.64645ZM3.64645 12.3536L9.64645 18.3536L10.3536 17.6464L4.35355 11.6464L3.64645 12.3536ZM4 12.5H19V11.5H4V12.5Z"
                  fill="white"
                />
              </svg>

              <div className="flex-grow flex justify-center">
                <span className="text-xl">Syarat & Ketentuan</span>
              </div>
            </div>
            <p className="text-[10px] text-center tracking-wider my-6 fontMon leading-relaxed">
              Harap membaca dengan seksama dan memahami syarat dan ketentuan AMS
              Membership
            </p>
            <p className="text-[10px] text-center tracking-wider fontMon leading-relaxed">
              Terakhir diupdate: 23 Januari 2025
            </p>
          </div>

          {/* content */}
          <div className="p-8 text-justify">
            <h2 className="text-base mb-5">SYARAT DAN KETENTUAN MEMBERSHIP</h2>
            <div className="text-[10px] fontMon leading-5">
              Selamat datang di AMS Membership, layanan resmi untuk Member AMS,
              yaitu program membership dari PT Aditya Mandiri Sejahtera yang
              menaungi 4 brand fashion ready to wear; Celcius, Celcius Woman,
              Misssissippi, dan Queensland. Harap membaca dan memahami syarat
              dan ketentuan AMS Membership ini karena syarat dan ketentuan ini
              mengatur penggunaan Anda atas program dan layanan sebagai Member
              AMS.
              <br />
              <br />
              Layanan kami memungkinkan Anda dalam membuat akun, menautkannya,
              dan menyediakan informasi, teks, grafik, atau lainnya tertentu.
              Setelah mendaftar sebagai member AMS, Anda menyetujui ketentuan
              sebagai kontrak yang mengikat secara hukum. Harap baca ketentuan
              ini dengan cermat sebelum menggunakan Layanan AMS Membership.
              <br />
              <br />
              Akses dan penggunaan Layanan bergantung pada penerimaan dan
              kepatuhan Anda terhadap ketentuan ini. Ketentuan ini berlaku untuk
              semua pengunjung, pengguna, dan pihak lain yang mengakses atau
              menggunakan Layanan. Keputusan untuk tidak menyetujui ketentuan
              ini akan berdampak pada pemutusan layanan yang kami berikan kepada
              Anda.
              <br />
              <br />
              <h2 className="text-sm my-5">Himbauan</h2>
              Kami menghimbau kepada seluruh pengguna untuk tidak melakukan
              tindakan kriminal atau melanggar ketentuan hukum apapun yang dapat
              merugikan pihak lain, baik dalam penggunaan maupun distribusi
              produk. Apabila tindakan tersebut dilakukan, maka segala akibat
              yang timbul menjadi tanggung jawab sepenuhnya dari pihak yang
              bersangkutan, dan kami tidak akan bertanggung jawab atas hal
              tersebut.
              <br />
              <br />
              Setiap pelanggaran terhadap hukum akan ditindak tegas sesuai
              dengan peraturan perundang-undangan yang berlaku. Kami juga
              mengingatkan bahwa setiap individu yang terlibat dalam kegiatan
              ilegal yang melibatkan produk dari brand-brand PT Aditya Mandiri
              Sejahtera dapat dikenakan sanksi hukum yang sesuai, termasuk namun
              tidak terbatas pada denda, hukuman penjara, atau tindakan hukum
              lainnya sesuai dengan ketentuan yang berlaku.
              <br />
              <br />
              <h2 className="text-sm my-5">Integritas Data</h2>
              Semua data dan informasi yang Anda sampaikan kepada kami melalui
              Platform, kami anggap sebagai data dan informasi yang benar serta
              akurat. Oleh karenanya Anda bertanggung jawab untuk membarui atau
              mengoreksi informasi dan data tersebut jika terdapat perubahan.
              <br />
              <br />
              <h2 className="text-sm my-5">Ketentuan Dasar</h2>
              <ul className="list-disc pl-5">
                <li>
                  Untuk menggunakan Layanan ini, Anda wajib berumur 17 tahun ke
                  atas.
                </li>
                <li>Keanggotaan Anda tidak dapat dipindahtangankan.</li>
                <li>
                  Tidak disarankan untuk membagikan nama pengguna dan kata sandi
                  kepada orang lain, atau mengizinkan orang lain untuk mengakses
                  Layanan menggunakan nama pengguna dan kata sandi Anda.
                </li>
                <li>
                  Anda bertanggung jawab atas setiap penggunaan Layanan yang
                  terjadi sehubungan dengan nomor anggota dan kata sandi atau
                  PIN.
                </li>
                <li>
                  Silakan informasikan kepada kami apabila melihat adanya
                  penggunaan tidak sah atas nomor keanggotaan atau kata
                  sandi/PIN Anda.
                </li>
                <li>
                  Tidak diperbolehkan menggunakan Layanan untuk tujuan ilegal
                  atau tidak sah.
                </li>
                <li>
                  Dalam menggunakan Layanan ini, Anda tidak diperbolehkan
                  menggunakan alamat email palsu, meniru identitas orang lain,
                  atau menggambarkan afiliasi palsu dengan pihak lain.
                </li>
                <li>
                  Dilarang mengadaptasi, meretas, atau memodifikasi Layanan lain
                  untuk memberikan kesan palsu bahwa Layanan tersebut berkaitan
                  dengan AMS.
                </li>
                <li>
                  Tidak diperbolehkan mengakses AMS Membership dengan cara apa
                  pun selain website resmi yang telah disediakan.
                </li>
                <li>
                  Tidak diperbolehkan untuk mencoba mengganggu atau mengubah
                  operasi website dengan cara apa pun (misalnya: menyerang
                  server, memasukkan virus, bom waktu, trojan horse, worm,
                  cancelbot, atau rutinitas komputer lainnya yang bersifat
                  merusak).
                </li>
                <li>
                  Tidak diperbolehkan memposting foto yang mempromosikan
                  rasisme, pornografi, atau yang mendiskreditkan orang atau
                  institusi mana pun sebagai foto profil.
                </li>
                <li>
                  Tidak diperbolehkan menggunakan Layanan dengan cara yang
                  melanggar hukum yang berlaku, melanggar kekayaan intelektual
                  pihak ketiga atau hak lainnya, atau dengan cara yang menipu,
                  tidak senonoh, menyinggung, atau memfitnah.
                </li>
                <li>
                  PT Aditya Mandiri Sejahtera tidak bertanggung jawab atas
                  kerugian yang dihasilkan dari segala bentuk pelanggaran dari
                  ketentuan yang telah disebutkan pada Syarat dan Ketentuan ini.
                </li>
                <li>
                  Pelanggaran terhadap perjanjian ini akan mengakibatkan
                  penghentian akun AMS Membership.
                </li>
                <li>
                  Dalam hal kami menghentikan keanggotaan karena alasan apa pun,
                  semua Poin AMS Membership akan hangus.
                </li>
              </ul>
              <h2 className="text-sm my-5">Kondisi umum</h2>
              <ul className="list-disc pl-5">
                <li>
                  Kami berhak untuk mengubah atau menghentikan Layanan dengan
                  alasan apa pun, tanpa pemberitahuan kapan pun.
                </li>
                <li>
                  Kami berhak mengubah ketentuan penggunaan ini kapan saja. Jika
                  hal tersebut merupakan perubahan material, kami akan
                  memberitahu melalui alamat email atau nomor telepon yang
                  tercantum pada profil Anda. Apa yang dimaksud dengan
                  "perubahan material" akan ditentukan berdasarkan kebijakan
                  kami sendiri, dengan itikad baik, dan menggunakan akal sehat
                  serta penilaian yang masuk akal.
                </li>
                <li>
                  Kami berhak untuk menolak Layanan kepada siapa pun dan kapan
                  pun, apabila ditemukan indikasi yang akan membawa dampak buruk
                  terhadap setiap pihak.
                </li>
                <li>
                  Kami berhak untuk memaksa pencabutan keanggotaan apa pun yang
                  menjadi tidak aktif, melanggar ketentuan kami, atau dapat
                  menyesatkan anggota lain.
                </li>
              </ul>
              <h2 className="text-sm my-5">Ganti Rugi</h2>
              <p>
                Anda bertanggung jawab dan akan mengganti kerugian serta
                melepaskan kami dari segala denda, hukuman, kewajiban, dan
                kerugian lainnya terhadap segala klaim yang timbul dari:
              </p>
              <ul className="list-disc pl-5">
                <li> Pelanggaran Anda terhadap syarat dan ketentuan ini;</li>
                <li> Kesalahan atau penipuan atau kelalaian Anda; atau</li>
                <li> Pelanggaran Anda terhadap hak pihak ketiga mana pun.</li>
              </ul>
              <h2 className="text-sm my-5">Komunikasi Elektronik</h2>
              <p>
                Anda setuju bahwa segala perjanjian, pemberitahuan dan
                komunikasi lain yang dikirimkan kepada Anda secara elektronik
                adalah sah secara hukum dan dianggap telah dikirim dan diterima
                oleh Anda saat dikirim ke Saluran Komunikasi yang Anda berikan
                kepada kami.
              </p>
              <p>
                Kami dapat berkomunikasi dengan Anda melalui surat, email,
                telepon, SMS, Platform, layanan obrolan Over the Top (OTT)
                antara lain WhatsApp, Signal, Telegram, dan lain-lain, atau
                melalui media sosial dan/atau saluran internet digital (“Saluran
                Komunikasi”). Kami dapat menggunakan sarana-sarana Saluran
                Komunikasi tersebut untuk menginformasikan status akun Anggota
                Anda, memberitahukan Anda apabila memenuhi syarat untuk program
                berhadiah, menginformasikan perubahan program, menawarkan
                promosi khusus, informasi serta penawaran yang kami anggap
                mungkin menarik untuk Anda, dan informasi lain apa pun yang kami
                anggap perlu untuk diinformasikan kepada Anda. Kami akan
                senantiasa menjaga data Anda sesuai dengan peraturan yang
                berlaku di Indonesia.
              </p>
              <h2 className="text-sm my-5">Ketersediaan Penggunaan Layanan</h2>
              <p>
                Layanan ini biasanya tersedia 24 jam sehari, tujuh hari
                seminggu. Namun, kami mungkin perlu menghentikan atau
                menangguhkan akses ke Layanan karena alasan pemeliharaan,
                teknis, atau lainnya.
              </p>
              <p>
                Saat mengakses dan menggunakan Layanan, Anda diwajibkan untuk
                mematuhi arahan, instruksi, atau protokol yang dipublikasikan di
                website.
              </p>
              <p>
                Kami dengan senang hati menawarkan berbagai Layanan di website,
                yang ingin kami kembangkan dan tingkatkan secara berkala.
                Layanan dapat diperbarui, diubah, atau dihapus sesuai kebijakan
                kami, sehingga kami tidak dapat menjamin bahwa Layanan tertentu
                akan selalu tersedia di website.
              </p>
              <h2 className="text-sm my-5">
                Mengaktifkan dan Menonaktifkan Lokasi
              </h2>
              <p>
                Kami membutuhkan Anda untuk mengaktifkan lokasi guna
                mengidentifikasi toko terdekat dengan dan/atau mengirimi materi
                promosi terkait toko terdekat. Informasi ini bersifat opsional,
                dan Anda dapat memilih untuk menonaktifkan lokasi.
              </p>
              <h2 className="text-sm my-5">Penghasilan Poin</h2>
              <p>
                Layanan ini berfungsi sebagai sarana tanpa batasan, memantau
                saldo poin atau menggunakan poin melalui penukaran poin. Untuk
                memproses perolehan poin apa pun, Anda harus menginformasikan
                nomor keanggotaan Anda kepada penanggung jawab transaksi,
                biasanya kasir di toko.
              </p>
              <h2 className="text-sm my-5">Ketentuan Penghasilan Poin:</h2>
              <ul className="list-disc pl-5">
                <li>
                  Anggota harus memberitahukan nomor ponsel yang aktif dan
                  terdaftar dalam program ke kasir di toko sebelum transaksi
                  pembelian untuk mendapatkan Poin AMS Membership.
                </li>
                <li>
                  Anggota akan memperoleh Poin dalam jumlah yang akan ditentukan
                  dari waktu ke waktu untuk setiap pembelanjaan di toko. Poin
                  AMS Membership diberikan berdasarkan harga bersih di luar
                  diskon, pajak dan biaya Layanan.
                </li>
                <li>
                  Waktu yang dibutuhkan untuk mengupdate saldo poin adalah 1
                  (satu) hari setelah tanggal transaksi. Namun, pada anomali
                  tertentu, kami berhak menentukan waktu yang tepat untuk
                  memperbarui saldo poin sesuai dengan sifat transaksi.
                </li>
              </ul>
              <h2 className="text-sm my-5">Penukaran Poin</h2>
              <h2 className="text-sm my-5">Ketentuan Penukaran Poin:</h2>
              <ul className="list-disc pl-5">
                <li>
                  Anda dapat menggunakan poin yang diperoleh untuk menukarkan
                  produk atau layanan apa pun yang tersedia melalui Layanan
                  ("Penukaran/Redeem").
                </li>
                <li>
                  Poin AMS Membership tidak dapat ditukar dengan uang tunai dan
                  tidak dapat dialihkan.
                </li>
                <li>
                  Poin AMS Membership yang dimiliki oleh lebih dari satu Anggota
                  tidak dapat digabungkan untuk membayar satu transaksi.
                </li>
                <li>
                  Setelah digunakan, Poin AMS Membership akan segera dipotong
                  dari akun Anda. Walaupun kami bertujuan untuk memastikan bahwa
                  poin AMS Anda tidak akan ditukarkan tanpa izin dan
                  persetujuan, Anda juga harus memastikan bahwa informasi AMS
                  Membership, seperti nomor ID AMS, PIN, atau kode penukaran,
                  aman, dan hanya tersedia untuk Anda.
                </li>
              </ul>
              <h2 className="text-sm my-5">Voucher</h2>
              <ul className="list-disc pl-5">
                <li>
                  Voucher hanya bisa digunakan pada store offline yang di naungi
                  oleh PT Aditya Mandiri Sejahtera.
                </li>
                <li>
                  Voucher mempunyai batas waktu (periode kedaluwarsa) sesuai
                  dengan ketentuan yang sudah ada pada syarat dan ketentuan
                  voucher.
                </li>
                <li>
                  Kode voucher hanya dapat digunakan untuk satu kali transaksi,
                  kecuali dinyatakan sebaliknya pada syarat dan ketentuan khusus
                  voucher.
                </li>
                <li>
                  Apabila Anda menggunakan kode voucher yang sama lebih dari
                  satu kali dalam satu hari, maka kode voucher akan otomatis
                  dibatalkan.
                </li>
                <li>
                  Voucher tidak dapat digunakan bersamaan dengan promosi atau
                  diskon lainnya.
                </li>
                <li>Voucher tidak dapat ditukar dengan uang atau diuangkan.</li>
                <li>
                  Kami berhak untuk merubah ketentuan penggunaan voucher ini
                  atau membatalkan setiap promosi sewaktu-waktu tanpa
                  pemberitahuan.
                </li>
              </ul>
              <h2 className="text-sm my-5">Kontak / Call Center</h2>
              <p>
                Untuk semua pertanyaan, keluhan, saran, kritik, dan klaim
                mengenai Layanan ini harap hubungi:
              </p>
              <p>PT Aditya Mandiri Sejahtera</p>
              <p>
                Jalan Kebayunan No.18, RT.02/RW.20, Tapos, Kec. Tapos, Kota
                Depok, Jawa Barat 16457
              </p>
              <p>Alamat Email: crm@amscorp.id</p>
              <p>Nomor Handphone: +62 811-1331-0569</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
