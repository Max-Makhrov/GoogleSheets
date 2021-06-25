/**
 * Splits string into equal parts.
 *
 * @param {string} str The string to chunk.
 * @param {number} length The length of parts.
 * @return Array - string splitted into parts with len = length.
 * @customfunction
 */
function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
function TESTchunkString() {
var str = '12312312';
Logger.log(chunkString(str, 2));

}

function chunkStringParts(str, parts) {
  var len = str.length;
  // length of a part
  var length = Math.ceil(len / parts);
  return chunkString(str, length);
}
function TESTchunkStringParts() {
var str = '12312312';
Logger.log(chunkStringParts(str, 3));

}





function byteCount(str) {
    return encodeURI(str).split(/%..|./).length - 1;
}
function TESTbyteCount() {
  var str = '["Оплата","Notes_Оплата",";",",","0B0pifCWzjn-iU0E4ZEJkUVE1N1E;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-iU0E4ZEJkUVE1N1E;0B0pifCWzjn-iU0E4ZEJkUVE1N1E;0B0pifCWzjn-iU0E4ZEJkUVE1N1E;0B0pifCWzjn-iU0E4ZEJkUVE1N1E;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-iU0E4ZEJkUVE1N1E;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U;0B0pifCWzjn-ib0ZWT2x1ekJUN1U","Новый акт. Интерес","Привет, <br><br>Доступен новый Акт по нашим проектам. Суммы в нем не итоговые, будут проверяться и финализироваться бухгалтерией 1 и 20 числа каждого месяца. Можно менять дату для просмотра прошедших периодов и следить за статистикой и видами выполняемых работ — это твой бизнес-план. <br><br>Процесс оплаты:<br>— работаем с командой в Бэйскампе;<br>— создаем тебе Акт передачи готовых задач;<br>— следим за дедлайнами, они у заголовка задачи;<br>— чем больше решений берешь на себя и чем меньше получаешь комментариев — тем выше оценка задач;<br>— когда задача готова и менеджер дает добро на закрытие <br>— закрываем задачу в Бэйскампе и проверяем ее появление в Акте;<br>— задачи оценены клиентом заранее, статистика в Акте и ты получаешь оплату 1 и 20 числа, каждого месяца.<br><br>Вопросы по задачам пишите в Скайп со ссылкой на Акт:","9;10;11;12;13;14;15;16;17;18;22;27;30;32;38;40;42;53;55;57;71;73;76;81;82;85;101","Оклад",28,"Акт. Александр Гольмаков;Акт. Эдуард Шинкаренко;Акт. Александра Иванова;Акт. Александр Озорнин;Акт. Вероника Лазарева;Акт. Дмитрий Горинов;Акт. Антон Баитов;Акт. Дмитрий Демидов;Акт. Николай Лисов;Акт. Наталия Холзакова ;Акт. Маша Сарычева;Акт. Дмитрий Сафаргалеев;Акт. Светлана Булега;Акт. Андрей Соболев;Акт. Екатерина Воронина;Акт. Вячеслав Малецкий;Акт. Анна Попова;Акт. Александр Лыгин;Акт. Алексей Иванов;Акт. Олег Сиреньщиков;Акт. Алексей Журавков;Акт. Даниил Шубин;Акт. Георгий Мацуков;Акт. Алексей Сидоров;Акт. Наталья Фатих;Акт. Януш Закшевский;Акт. Ирина Телелинская","1LNjRUxtfBWkilMUTEUs-zXzRwDb6A7kKvTFrF3B7d3Y;1vPboV01XESEU9puSkjCZegMEijTLoh7bqoBgsWGWqIU;1mnouZTzICUztlJP-pSmIdxjUBN-9i9_5Lb5fLxjOWiY;1Wp7xV1vdzG8gVhDY5QJpqbtBPaeHYvjnej7YhHbfX40;1PcCUxbcv8Dlq2KNFhMUSYls_ekZqcYMiFi60QNOcx6Y;1qu7yFA5X7P9JnTVAiC9HK0geHcQDSOomITjEPE_k94Y;1QR-PVPt3zqfs_l4tUe9zFzFctJhNO35z3Z_PWfvwGL4;1I9HM9HjDTA0-Rmvcn5trLYd8lg_akuYP5igM5ZagR4I;1il7W8C4UciPk6TP9sHtkTGO1TKySuugtUjcnj99YGCI;1K-uGD1LV-2_BeOJQUAa-GHASCTCOC5nRLxwS6vwF4Vk;1Z6lwi5FUSgWBMCmB9LGzH1DyVr0qQKbhRYqJgtWE6pE;1rg5UPBEjGkEdlwC7VbNv7CBfGUz-TaDFmhATf2LKatY;1Hi16D3Vyura57qq5S4vCWi6ceFyf9LX6zXJvqdRUtww;1GhR0-wOEatnfuf8ctcrV-k_jhHstpCPzf7Rovb79Lhs;1tpwtdI1ay2wGSDsKth4ocN6wwY8CdzpAxIu9ZBFkMV4;1Eydl15P90lidQX-2zDPiOF5_a1aNFvIzXkIXBOtbvBM;1j1_JUU2U6wugiM6mLQJMDzAFaI-73-kHGwhm4-DkB1w;1jHpGoJdRFiPeXaEB2Ekj7Ya_Tg_TByBhipQwlBNg_No;1GookP-bv7kHNvkBuiP5kBJgyurIMH6B63XKw3DC9dlo;1Pj6O8TPgn39cdqjUNoK4nFll9c1F7QWxDn0hCj8dj5o;1lLwYlTRLpBEUHiHSYZQYw6S7xt6jIxohXfcyu9olWGU;1a1-42lE6BWffFp3clLolXa4hPkT13fYeRURHKlUOGSY;1HF1p-rGiJO-K4RzFHrauuLsc-YlQj6PGRNorAEdTdb8;1P7HHpueuwfvSzpYngbvIK5f-y1ge0ti6Tt0ddFnZjgw;1plI0jCaZi1dlvatrK1hvSzD-AVoDegv6jaSLzzSgEio;1ZcvIBbFU4JCUOl8LWpdJFf4AUr0_4JeBKw8OzFszcg0;1jBEv-yO5DQVbI7xx0ayA64ADnJcnDYvTUnbei8SfzUc","4;5;6;7;8;9;10;11;12;13;17;22;25;27;33;35;37;48;50;52;66;68;71;76;77;80;96","data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data;data","idLoadStaff","Акт_форма#2 офис;Акт_форма#1;Акт_форма#2 офис;Акт_форма#2 офис;Акт_форма#2 офис;Акт_форма#2 офис;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#2 офис;Акт_форма#1;Акт_форма#1;Акт_форма#1;Акт_форма#1","A1;A2;B2;C2;B6;A8;A9;B9;C9;D9;E9;F9;G9;H9;I9;J9;K9;L9;M9;N9;O9;P9;Q9;R9;S9","=iferror(QUOTEАкт №QUOTE&data!A2&QUOTE-QUOTE&IFERROR(VLOOKUP(if(B4=QUOTEТекущийQUOTE;data!AC3;B4);data!D:E;2;0);QUOTEQUOTE)&QUOTE. QUOTE&if(B4=QUOTEТекущийQUOTE;data!AC3;B4)&QUOTE. QUOTE&data!B2;QUOTEнет работ за QUOTE&if(B4=QUOTEТекущийQUOTE;data!AC3;B4))~=HYPERLINK(data!AF6;data!AF4)~=data!AF8~=data!AF2~=if(B4=QUOTEвсеQUOTE;sum(data!AA:AA);sumifs(data!AA:AA;data!Z:Z;if(B4=QUOTEТекущийQUOTE;data!AC3;B4)))~={data!F1:X1}~=if($B$4=QUOTEвсеQUOTE;{data!F2:F};IFERROR(FILTER(data!F:F;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!G2:G};IFERROR(FILTER(data!G:G;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=ARRAYFORMULA(REGEXREPLACE(if($B$4=QUOTEвсеQUOTE;{data!H2:H};IFERROR(FILTER(data!H:H;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE));QUOTESLASHNUMSYMBOLQUOTE;))~=if($B$4=QUOTEвсеQUOTE;{data!I2:I};IFERROR(FILTER(data!I:I;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTEнет данныхQUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!J2:J};IFERROR(FILTER(data!J:J;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!K2:K};IFERROR(FILTER(data!K:K;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!L2:L};IFERROR(FILTER(data!L:L;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!M2:M};IFERROR(FILTER(data!M:M;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!N2:N};IFERROR(FILTER(data!N:N;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!O2:O};IFERROR(FILTER(data!O:O;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!P2:P};IFERROR(FILTER(data!P:P;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!Q2:Q};IFERROR(FILTER(data!Q:Q;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!R2:R};IFERROR(FILTER(data!R:R;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!S2:S};IFERROR(FILTER(data!S:S;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!T2:T};IFERROR(FILTER(data!T:T;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!U2:U};IFERROR(FILTER(data!U:U;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!V2:V};IFERROR(FILTER(data!V:V;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!W2:W};IFERROR(FILTER(data!W:W;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))~=if($B$4=QUOTEвсеQUOTE;{data!X2:X};IFERROR(FILTER(data!X:X;data!$D:$D=if($B$4=QUOTEТекущийQUOTE;data!$AC$3;$B$4));QUOTE-QUOTE))","~","Акт!B4","Data!AC1:AC110","makhrov.max@gmail.com;ed.shynkarenko@gmail.com;makhrov.max@gmail.com;makhrov.max@gmail.com;makhrov.max@gmail.com;makhrov.max@gmail.com;kopraji@ya.ru;dmitrypg@gmail.com;nikolay.lisov@gmail.com;t89829930444@gmail.com;marijein1@gmal.com;onshift@gmail.com;svetik070183@gmail.com;poftimus@gmail.com;makkater@gmail.com;mvpconglomerate@gmail.com;popova.a.s.1992@gmail.com;kukuman@mail.ru;i1lexey@gmail.com;2769511@gmail.com;mr.zhuravkov@gmail.com;shubindesign@gmail.com;makhrov.max@gmail.com;forjetx@gmail.com;fatich@yandex.ru;hinthunter.net@gmail.com;dizderi92@yandex.ru"]';  
  var lenInBites = byteCount(str)
  
  
  Logger.log(lenInBites);
  Logger.log(Math.ceil(lenInBites / 9000));
  
}


/*
  works like function REGEXREPLACE
*/  
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}
