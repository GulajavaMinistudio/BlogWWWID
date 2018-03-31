import moment from 'moment';
import ArtikelModel from '@/components/models/ArtikelModel';

class ParserTanggal {
    tanggalMentah = '';

    parseTanggalKeBaku(valMentah) {
      this.tanggalMentah = valMentah;
      // 2018-02-16 04:13:04
      const momentMentah = moment(this.tanggalMentah, 'YYYY-MM-DD HH:mm:ss');
      const stringTanggalBaku = momentMentah.format('HH:mm, dddd DD MMM YYYY');
      return stringTanggalBaku;
    }
}

class ParserDaftarArtikel {
    artikelBaku = [];

    /**
     * konversi tanggal yang ada di dalam artikel
     * @param {Array} listArtikel daftar artikel dalam bentuk array
     */
    static parseSusunArtikel(listArtikel = []) {
      const parserTanggal = new ParserTanggal();
      const panjangArtikel = listArtikel.length;
      for (let i = 0; i < panjangArtikel; i += 1) {
        const artikel = listArtikel[i];
        const tanggalbaku = parserTanggal.parseTanggalKeBaku(artikel.pubDate);
        const newsModel = new ArtikelModel(
          artikel.title,
          tanggalbaku,
          artikel.link,
          artikel.guid,
          artikel.author,
          artikel.thumbnail,
          artikel.description,
          artikel.content,
          artikel.categories,
        );
        this.artikelBaku = this.artikelBaku.push(newsModel);
      }
      return this.artikelBaku;
    }
}

class ParserKategori {
    listKategori = [];

    /**
     * @description parse array kategori artikel ke dalam bentuk satu array saja
     * @param {Array} listArtikel daftar artikel
     */
    static parseKategoriSemuaArtikel(listArtikel = []) {
      const panjangArtikel = listArtikel.length;
      for (let i = 0; i < panjangArtikel; i += 1) {
        const artikel = listArtikel[i];
        const categories = artikel.categories;
        const panjangKategori = categories.length;
        for (let j = 0; j < panjangKategori; j += 1) {
          const namaKategori = categories[j];
          this.listKategori = this.listKategori.push(namaKategori);
        }
      }
      return this.listKategori;
    }
}

export { ParserTanggal, ParserKategori, ParserDaftarArtikel };

