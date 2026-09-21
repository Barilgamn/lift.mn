/**
 * KLEEMANN-ы бүхээг, хаалга, панорама болон ачааны лифтний сонголтууд.
 *
 * Эх сурвалж: KLEEMANN "Cabins Kabinen" каталог (2019).
 * Энэ файлыг гараар бүү зас — каталогоос автоматаар гаргаж авсан.
 * Материалын код (RAL 7032, Laminate 8096 г.м) нь үйлдвэрлэгчийн дугаар
 * тул орчуулалгүй хэвээр үлдээв.
 */

export interface CabinSpecRow {
  label: string;
  value: string;
}

export interface CabinVariant {
  id: string;
  image: string;
  spec: CabinSpecRow[];
}

export interface CabinModel {
  code: string;
  variants: CabinVariant[];
}

export interface CabinTheme {
  id: string;
  title: string;
  note: string;
  models: CabinModel[];
}

export interface OptionItem {
  id: string;
  title: string;
  note: string;
  image: string;
}

export interface OptionGroup {
  id: string;
  title: string;
  note: string;
  items: OptionItem[];
}

/** Гурван дизайн загвар, тус бүр өөрийн бүхээгийн загваруудтай */
export const CABIN_THEMES: CabinTheme[] = [
  {
    id: 'future',
    title: 'Future Trend',
    note: 'Орчин үеийн муруй хэлбэр, далд гэрэлтүүлэг',
    models: [
      {
        code: 'T710',
        variants: [
          {
            id: 't710-1',
            image: '/images/cabins/t710-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T710 (Curved Steel Sheet White with hidden light)' },
              { label: 'Хана', value: 'Curved Steel Sheet RAL 5017' },
              { label: 'Завсар, хаалганы хүрээ', value: 'Stainless Steel Satin (Door Posts min 80mm)' },
              { label: 'Шал', value: 'Laminate 8096' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 't710-2',
            image: '/images/cabins/t710-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T710 (Curved Steel Sheet White with hidden light)' },
              { label: 'Хана', value: 'Curved Steel Sheet RAL 7032' },
              { label: 'Завсар, хаалганы хүрээ', value: 'Stainless Steel Satin (Door Posts min 80mm)' },
              { label: 'Шал', value: 'Laminate 8096' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 't710-3',
            image: '/images/cabins/t710-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T710 (Curved Steel Sheet White with hidden light)' },
              { label: 'Хана', value: 'Curved Steel Sheet RAL 9022' },
              { label: 'Завсар, хаалганы хүрээ', value: 'Stainless Steel Satin (Door Posts min 80mm)' },
              { label: 'Шал', value: 'Laminate 8096' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'T510',
        variants: [
          {
            id: 't510-1',
            image: '/images/cabins/t510-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T510 (Steel Sheet with milky plexiglass)' },
              { label: 'Хана', value: 'Steel Sheet RAL 2004' },
              { label: 'Булан, завсар, хаалганы хүрээ', value: 'Stainless Steel Mirror (Door Posts min 130mm)' },
              { label: 'Шал', value: 'Special Safety Glass with Stainless Steel Curves RAL 2004' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 't510-2',
            image: '/images/cabins/t510-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T510 (Steel Sheet with milky plexiglass)' },
              { label: 'Хана', value: 'Steel Sheet RAL 1028' },
              { label: 'Булан, завсар, хаалганы хүрээ', value: 'Stainless Steel Mirror (Door Posts min 130mm)' },
              { label: 'Шал', value: 'Special Safety Glass with Stainless Steel Curves RAL 1028' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 't510-3',
            image: '/images/cabins/t510-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T510 (Steel Sheet White with milky plexiglass)' },
              { label: 'Хана', value: 'Steel Sheet RAL 7001' },
              { label: 'Булан, завсар, хаалганы хүрээ', value: 'Stainless Steel Mirror (Door Posts min 130mm)' },
              { label: 'Шал', value: 'Special Safety Glass with Stainless Steel Curves RAL 7001' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin' },
            ],
          },
        ],
      },
      {
        code: 'T310',
        variants: [
          {
            id: 't310-1',
            image: '/images/cabins/t310-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T310 (Curved Steel Sheet White with hidden light)' },
              { label: 'Хана', value: 'Curved Steel Sheet 4001 Corners-Door Posts Stainless Steel Mirror (Door Posts min 110mm)' },
              { label: 'Шал', value: 'Ceramic Tile Nero Marquinia' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 't310-2',
            image: '/images/cabins/t310-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T310 (Curved Steel Sheet White with hidden light)' },
              { label: 'Хана', value: 'Curved Steel Sheet 9002 Corners-Door Posts Stainless Steel Mirror (Door Posts min 110mm)' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 't310-3',
            image: '/images/cabins/t310-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T310 (Curved Steel Sheet White with hidden light)' },
              { label: 'Хана', value: 'Curved Steel Sheet V56 Corners-Door Posts Stainless Steel Mirror (Door Posts min 110mm)' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FPY Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'T110',
        variants: [
          {
            id: 't110-1',
            image: '/images/cabins/t110-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T110' },
              { label: 'Хана', value: 'Special Melamine Panels 147' },
              { label: 'Булан', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 't110-2',
            image: '/images/cabins/t110-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T110' },
              { label: 'Хана', value: 'Special Melamine Panels K015PW' },
              { label: 'Булан', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 't110-3',
            image: '/images/cabins/t110-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T110' },
              { label: 'Хана', value: 'Special Melamine Panels K013 SU' },
              { label: 'Булан', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Ceramic Tile Greek Pentelikon' },
              { label: 'Бариул', value: 'K1 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'T120',
        variants: [
          {
            id: 't120-1',
            image: '/images/cabins/t120-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T120' },
              { label: 'Хана', value: 'Special Melamine Panels K015 PW' },
              { label: 'Хаалганы хүрээ', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K1 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 't120-2',
            image: '/images/cabins/t120-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T120' },
              { label: 'Хана', value: 'Special Melamine Panels 145' },
              { label: 'Хаалганы хүрээ', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K1 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 't120-3',
            image: '/images/cabins/t120-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling T120' },
              { label: 'Хана', value: 'Special Melamine Panels 0125BS' },
              { label: 'Хаалганы хүрээ', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K1 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'modern',
    title: 'Modern Life',
    note: 'Зэвэрдэггүй ган, шил — цэвэрхэн, тод шугам',
    models: [
      {
        code: 'L530',
        variants: [
          {
            id: 'l530-1',
            image: '/images/cabins/l530-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 014 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Combination of Stainless Steel Mirror (Back) and Satin (Sides)' },
              { label: 'Булан, завсар, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Laminate 8096' },
              { label: 'Бариул', value: 'K7 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
          {
            id: 'l530-2',
            image: '/images/cabins/l530-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 03 Material: Stainless Steel 12LG' },
              { label: 'Хана', value: 'Combination of Stainless Steel Satin (Back) and Stainless Steel 12LG (Sides)' },
              { label: 'Булан, завсар, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K7 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'L520',
        variants: [
          {
            id: 'l520-2',
            image: '/images/cabins/l520-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: Special Ceiling L520 (Curved Steel Sheet White)tainless Steel Bronze' },
              { label: 'Хана', value: 'Material: Combination of Stainless Steel Mirror and Lightened White Glass' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Linoleum 6674' },
              { label: 'Бариул', value: 'K7 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line MODERN LIFE L520' },
            ],
          },
        ],
      },
      {
        code: 'L510',
        variants: [
          {
            id: 'l510-1',
            image: '/images/cabins/l510-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 013 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Glass B14W Blue' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Laminate 8096' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
          {
            id: 'l510-2',
            image: '/images/cabins/l510-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 015 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Glass Y8W Yellow Mat' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Elastic Black 6801' },
              { label: 'Бариул', value: 'K7 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
          {
            id: 'l510-3',
            image: '/images/cabins/l510-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 015 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Glass B123W White' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K7 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'L320',
        variants: [
          {
            id: 'l320-1',
            image: '/images/cabins/l320-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 03 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Skinplate PPS31' },
              { label: 'Хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Half Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 'l320-2',
            image: '/images/cabins/l320-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 010 Material: Stainless Steel Satin and plexiglass' },
              { label: 'Хана', value: 'Skinplate DL86' },
              { label: 'Хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Ceramic Tile GP5 Nero' },
              { label: 'Бариул', value: 'K4 Stainless Steel Satin' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 'l320-3',
            image: '/images/cabins/l320-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 055 Material: Stainless Steel Satin and plexiglass' },
              { label: 'Хана', value: 'Skinplate PPS13' },
              { label: 'Хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Elastic Anthracite 6727' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Half Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'L310',
        variants: [
          {
            id: 'l310-1',
            image: '/images/cabins/l310-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 010 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Stainless Steel Satin' },
              { label: 'Хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Elastic Anthracite 6727' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 'l310-2',
            image: '/images/cabins/l310-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 015 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Stainless Steel Checks' },
              { label: 'Хаяавч', value: 'Stainless Steel Checks' },
              { label: 'Шал', value: 'Rubber Griffon 6768' },
              { label: 'Бариул', value: 'K7 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 'l310-3',
            image: '/images/cabins/l310-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: 055 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Inox B/A Linen' },
              { label: 'Хаяавч', value: 'Inox B/A Linen' },
              { label: 'Шал', value: 'Laminate 720' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'classic',
    title: 'Classic Athena',
    note: 'Модон, арьсан өнгөлгөө — дулаан, сонгодог',
    models: [
      {
        code: 'A520',
        variants: [
          {
            id: 'a520-1',
            image: '/images/cabins/a520-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O55 with plexiglass diffuser Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Artificial Leather Bowling 7004' },
              { label: 'Булан, завсар, хаяавч', value: 'Inward Curves, Shadow gaps and Skirtings Stainless Steel Mirror' },
              { label: 'Шал', value: 'Artificial Granite Greek Pentelikon' },
              { label: 'Бариул', value: 'K3 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
          {
            id: 'a520-2',
            image: '/images/cabins/a520-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O3 with plexiglass diffuser Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Artificial Leather Saronno S-7005' },
              { label: 'Булан, завсар, хаяавч', value: 'Inward Curves, Shadow gaps and Skirtings Stainless Steel Mirror' },
              { label: 'Шал', value: 'Ceramic Tiles Nero' },
              { label: 'Бариул', value: 'K3 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line n,' },
            ],
          },
          {
            id: 'a520-3',
            image: '/images/cabins/a520-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O15 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Artificial Leather Madeira S-4411' },
              { label: 'Булан, завсар, хаяавч', value: 'Inward Curves, Shadow gaps and Skirtings Stainless Steel Mirror' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K3 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'A510',
        variants: [
          {
            id: 'a510-1',
            image: '/images/cabins/a510-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O14 Material: Stainless Steel Gold Mirror' },
              { label: 'Хана', value: 'Polished Oak Veneer IVE 14' },
              { label: 'Завсар, хаяавч', value: 'Stainless Steel Gold Mirror' },
              { label: 'Шал', value: 'Artificial Granite Greek Pentelikon' },
              { label: 'Бариул', value: 'K2 Stainless Steel Gold Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Gold Mirror with Blue Line' },
            ],
          },
          {
            id: 'a510-2',
            image: '/images/cabins/a510-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O14 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Polished Oak Veneer IVE 14' },
              { label: 'Завсар, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Artificial Granite Greek Pentelikon' },
              { label: 'Бариул', value: 'K1 Stainless Steel Mirror' },
              { label: 'Толь', value: '3/4 Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
          {
            id: 'a510-3',
            image: '/images/cabins/a510-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O10 Material: Stainless Mirror and plexiglass' },
              { label: 'Хана', value: 'Wood Veneer VC-1181' },
              { label: 'Завсар, хаяавч', value: 'Stainless Steel Mirror' },
              { label: 'Шал', value: 'Artificial Granite Regal White' },
              { label: 'Бариул', value: 'K1 Stainless Steel Mirror' },
              { label: 'Толь', value: '3/4 Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC BES Stainless Steel Mirror with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'A320',
        variants: [
          {
            id: 'a320-1',
            image: '/images/cabins/a320-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O10 Material: White Steel Sheet' },
              { label: 'Хана', value: 'Skinplate PPS93' },
              { label: 'Булан, хаяавч', value: 'Skinplate F12PPS' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
          {
            id: 'a320-2',
            image: '/images/cabins/a320-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O10 Material: White Steel Sheet' },
              { label: 'Хана', value: 'Skinplate B13' },
              { label: 'Булан, хаяавч', value: 'Skinplate Ν19SA' },
              { label: 'Шал', value: 'Elastic Griffon 6768' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 'a320-3',
            image: '/images/cabins/a320-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O10 Material: White Steel Sheet' },
              { label: 'Хана', value: 'Skinplate A90GTA' },
              { label: 'Булан, хаяавч', value: 'Skinplate PPS93' },
              { label: 'Шал', value: 'Elastic Black 6801' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
      {
        code: 'A310',
        variants: [
          {
            id: 'a310-1',
            image: '/images/cabins/a310-1.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O55 Material: Stainless Steel Mirror and plexiglass' },
              { label: 'Хана', value: 'Laminate HD 2416 PL' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Laminate 8630 Aspen Oak' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'FTC Black' },
            ],
          },
          {
            id: 'a310-2',
            image: '/images/cabins/a310-2.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O15 Material: Stainless Steel Mirror' },
              { label: 'Хана', value: 'Laminate AB 383' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Elastic 6603' },
              { label: 'Бариул', value: 'K3 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Full Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'AKC HBT Stainless Steel Satin' },
            ],
          },
          {
            id: 'a310-3',
            image: '/images/cabins/a310-3.webp',
            spec: [
              { label: 'Тааз', value: 'Type: O55 Material: Stainless Steel Mirror and plexiglass' },
              { label: 'Хана', value: 'Laminate MT 2042' },
              { label: 'Булан, хаяавч', value: 'Stainless Steel Satin' },
              { label: 'Шал', value: 'Elastic Black 6801' },
              { label: 'Бариул', value: 'K2 Stainless Steel Mirror' },
              { label: 'Толь', value: 'Half Ηeight / Full Width' },
              { label: 'Удирдлагын хавтан', value: 'SM BA Stainless Steel Satin with Blue Line' },
            ],
          },
        ],
      },
    ],
  },
];

/** Панорама бүхээг, хаалга, ачааны лифтний сонголтууд */
export const OPTION_GROUPS: OptionGroup[] = [
  {
    id: 'panoramic',
    title: 'Панорама бүхээг',
    note: 'Шилэн ханатай, барилгын дотоод засалтай нийцсэн хэлбэрүүд',
    items: [
      {
        id: 'panoramic-t710-double-side',
        title: 'Panoramic T710 Double Side',
        note: 'Хоёр талын хаалгатай',
        image: '/images/cabins/panoramic-t710-double-side.webp',
      },
      {
        id: 'panoramic-t710-one-side',
        title: 'Panoramic T710 One Side',
        note: 'Нэг талын хаалгатай',
        image: '/images/cabins/panoramic-t710-one-side.webp',
      },
      {
        id: 'panoramic-t310-one-side',
        title: 'Panoramic T310 One Side',
        note: 'Нэг талын хаалгатай',
        image: '/images/cabins/panoramic-t310-one-side.webp',
      },
      {
        id: 'panoramic-t310-double-side',
        title: 'Panoramic T310 Double Side',
        note: 'Хоёр талын хаалгатай',
        image: '/images/cabins/panoramic-t310-double-side.webp',
      },
      {
        id: 'frameless-panoramic',
        title: 'Frameless Panoramic',
        note: 'Хүрээгүй шилэн бүхээг',
        image: '/images/cabins/frameless-panoramic.webp',
      },
      {
        id: 'glass-ceiling-panoramic',
        title: 'Glass Ceiling Panoramic',
        note: 'Шилэн таазтай',
        image: '/images/cabins/glass-ceiling-panoramic.webp',
      },
      {
        id: 'square-panoramic',
        title: 'Square Panoramic',
        note: 'Дөрвөлжин',
        image: '/images/cabins/square-panoramic.webp',
      },
      {
        id: 'curved-panoramic',
        title: 'Curved Panoramic',
        note: 'Хагас дугуй',
        image: '/images/cabins/curved-panoramic.webp',
      },
      {
        id: 'round-panoramic',
        title: 'Round Panoramic',
        note: 'Бүтэн дугуй',
        image: '/images/cabins/round-panoramic.webp',
      },
      {
        id: 'polygonal-panoramic',
        title: 'Polygonal Panoramic',
        note: 'Олон талт',
        image: '/images/cabins/polygonal-panoramic.webp',
      },
      {
        id: 'mushroom-panoramic',
        title: 'Mushroom Panoramic',
        note: 'Мөөг хэлбэрийн',
        image: '/images/cabins/mushroom-panoramic.webp',
      },
    ],
  },
  {
    id: 'doors',
    title: 'Хаалга',
    note: 'Бүхээг болон давхрын хаалганы төрлүүд',
    items: [
      {
        id: 'f710',
        title: 'F710',
        note: 'Хагас автомат (Future Trend)',
        image: '/images/cabins/f710.webp',
      },
      {
        id: 'fd710',
        title: 'FD710',
        note: 'Хагас автомат (Future Trend)',
        image: '/images/cabins/fd710.webp',
      },
      {
        id: 'f310',
        title: 'F310',
        note: 'Эвхмэл (Future Trend)',
        image: '/images/cabins/f310.webp',
      },
      {
        id: 'fa710',
        title: 'FA710',
        note: 'Автомат, бүтэн шил',
        image: '/images/cabins/fa710.webp',
      },
      {
        id: 'fa310',
        title: 'FA310',
        note: 'Автомат, бүтэн шил',
        image: '/images/cabins/fa310.webp',
      },
      {
        id: 'm310',
        title: 'M310',
        note: 'Хагас автомат (Modern Life)',
        image: '/images/cabins/m310.webp',
      },
      {
        id: 'm510',
        title: 'M510',
        note: 'Хагас автомат (Modern Life)',
        image: '/images/cabins/m510.webp',
      },
      {
        id: 'fd730',
        title: 'FD730',
        note: 'Эвхмэл (Modern Life)',
        image: '/images/cabins/fd730.webp',
      },
      {
        id: 'automatic-full-glass',
        title: 'Automatic Full Glass',
        note: 'Автомат, бүтэн шил',
        image: '/images/cabins/automatic-full-glass.webp',
      },
      {
        id: 'automatic-big-vision',
        title: 'Automatic Big Vision',
        note: 'Автомат, өргөн харагдацтай',
        image: '/images/cabins/automatic-big-vision.webp',
      },
      {
        id: 'c710',
        title: 'C710',
        note: 'Хагас автомат (Classic Athena)',
        image: '/images/cabins/c710.webp',
      },
      {
        id: 'c310',
        title: 'C310',
        note: 'Хагас автомат (Classic Athena)',
        image: '/images/cabins/c310.webp',
      },
      {
        id: 'fd330',
        title: 'FD330',
        note: 'Эвхмэл (Classic Athena)',
        image: '/images/cabins/fd330.webp',
      },
      {
        id: 'automatic',
        title: 'Automatic',
        note: 'Автомат хаалга (Classic Athena)',
        image: '/images/cabins/automatic.webp',
      },
      {
        id: 'c520',
        title: 'C520',
        note: 'Автомат, RAL 7032 өнгөтэй',
        image: '/images/cabins/c520.webp',
      },
    ],
  },
  {
    id: 'freight',
    title: 'Ачааны болон тусгай лифт',
    note: 'Үйлдвэр, эмнэлэг, авто зогсоолын зориулалттай',
    items: [
      {
        id: 'custom-hydraulic-freight-lift',
        title: 'Custom Hydraulic Freight Lift',
        note: 'Захиалгат гидравлик — 3.6 × 8 × 4.7 м',
        image: '/images/cabins/custom-hydraulic-freight-lift.webp',
      },
      {
        id: 'atlas-traction-mrl',
        title: 'Atlas Traction MRL',
        note: 'Машины өрөөгүй татах системтэй',
        image: '/images/cabins/atlas-traction-mrl.webp',
      },
      {
        id: 'hydraulic-lift-10-000-kg',
        title: 'Hydraulic Lift 10.000 kg',
        note: 'Гидравлик — 10 000 кг даац',
        image: '/images/cabins/hydraulic-lift-10-000-kg.webp',
      },
      {
        id: 'hydraulic-lift',
        title: 'Hydraulic Lift',
        note: 'Гидравлик ачааны лифт',
        image: '/images/cabins/hydraulic-lift.webp',
      },
      {
        id: 'autolift',
        title: 'AutoLift',
        note: 'Хос поршентой, 4 800 кг — 3 дахь хаалгатай',
        image: '/images/cabins/autolift.webp',
      },
      {
        id: 'medilift',
        title: 'MediLift',
        note: 'Эмнэлгийн лифт',
        image: '/images/cabins/medilift.webp',
      },
      {
        id: 'atlas-gigas-traction-mrl',
        title: 'Atlas Gigas Traction MRL',
        note: 'Том даацын татах системтэй',
        image: '/images/cabins/atlas-gigas-traction-mrl.webp',
      },
    ],
  },
];
