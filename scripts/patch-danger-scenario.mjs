/**
 * Smart patch script: uses group index to apply translations to dangerScenarioGroups
 * Run: node scripts/patch-danger-scenario.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN = path.join(__dirname, "../app/data/questions.vi.json");

const data = JSON.parse(fs.readFileSync(IN, "utf8"));

// --- Translations indexed by group position in dangerScenarioGroups ---
// Group 0 = 11_1 (already translated), groups 1-29 need work

const stemTranslations = [
  // [groupIndex] = stemVi
  null, // 0: 11_1 - already translated
  "Đang chạy với tốc độ 30 km/h trên đường cong gấp. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 5 km/h. Khi rẽ trái ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Khi rẽ phải ngã tư, cần chú ý điều gì?",
  "Ban đêm, đang chạy với tốc độ 10 km/h. Khi rẽ phải ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h gần đỉnh dốc. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Khi đi thẳng qua ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h trên đường cong gấp. Cần chú ý điều gì?",
  "Ban đêm, đang chạy với tốc độ 10 km/h. Khi rẽ trái ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h trên đường cong gấp. Phía trước có xe đỗ. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Phía trước đang kẹt xe. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h trên đường cong dốc lên. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Khi rẽ phải ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Phía trước có taxi đỗ. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Khi phía trước có xe đỗ, cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Phía trước có taxi đỗ. Cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Khi đi thẳng qua ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Khi rẽ phải ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 10 km/h. Khi rẽ trái ngã tư, cần chú ý điều gì?",
  "Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
  "Ban đêm, đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?",
];

// [groupIndex][subIndex] = { textVi, explanationVi? }
const subTranslations = [
  // [groupIndex][subIndex]
  // 11_1 (index 0) - already done
  [],
  // 11_2 (index 1)
  [
    { textVi: "Xe hai bánh khó mất thăng bằng ở đường cong nên không cần chú ý đặc biệt." },
    { textVi: "Vì xe hai bánh chạy chậm và không thấy xe đối diện nên đã vượt xe một cách an toàn." },
    { textVi: "Nghiêng sang trái, giảm tốc độ và đi qua đường cong." },
  ],
  // 11_3 (index 2)
  [
    { textVi: "Vì xe phía trước đã đi nên nghĩ là an toàn, rồi đi thẳng luôn." },
    { textVi: "Dừng xe trước đường bộ nhỏ, xác định an toàn bằng mắt và tai." },
    { textVi: "Khi qua đường bộ nhỏ, để tránh va chạm với xe đối diện, đi gần mép đường bộ nhỏ." },
  ],
  // 11_4 (index 3)
  [
    { textVi: "Ngày mưa, dù làm bắn nước hoặc bùn lên người đi bộ cũng không sao." },
    { textVi: "Vì người đi bộ có thể không nhận ra xe mình đến gần vì tiếng mưa, nên cẩn thận lái xe." },
    { textVi: "Vì người đi bộ có thể nhìn xuống dưới và không nhận ra xe mình, nên cẩn thận lái xe." },
  ],
  // 11_5 (index 4)
  [
    { textVi: "Tăng tốc để rẽ trái trước khi người đi bộ và xe tải rẽ trái." },
    { textVi: "Vì đi cùng xe tải rẽ trái có thể bị cuốn vào, nên ở vị trí này phanh và đợi xe tải rẽ trái." },
    { textVi: "Xe tải dừng lại đột ngột và đã có lối đi nên rẽ trái gấp.", explanationVi: "Xe tải có thể đã dừng lại vì nhận ra người đi bộ. Dù xe tải đã dừng và có lối đi, cũng phải xác nhận an toàn kỹ lưỡng rồi mới rẽ trái." },
  ],
  // 11_6 (index 5)
  [
    { textVi: "Vì người đi bộ qua đường có vẻ như sẽ dừng lại nên rẽ phải." },
    { textVi: "Vì xe hai bánh có thể đi thẳng từ bóng của xe buýt, nên cẩn thận." },
    { textVi: "Xe buýt rẽ phải nên nghĩ ngã tư đã an toàn, rồi rẽ phải gấp." },
  ],
  // 11_7 (index 6)
  [
    { textVi: "Vì có xe đối diện nên giảm đèn xuống thấp và tiến vào." },
    { textVi: "Sau khi người đi bộ qua đường xong thì không có nguy hiểm nên rẽ phải gấp." },
    { textVi: "Người đi bộ qua đường được ưu tiên trước." },
  ],
  // 11_8 (index 7)
  [
    { textVi: "Vì công nhân có thể bất ngờ chạy ra từ công trường nên cẩn thận đi qua." },
    { textVi: "Vì có xe phía sau nên khi giảm tốc thì phanh nhiều lần chia nhỏ." },
    { textVi: "Khi đổi làn đường thì không chỉ nhìn gương mà còn phải quan sát trực tiếp bằng mắt để xác nhận an toàn." },
  ],
  // 11_9 (index 8)
  [
    { textVi: "Vì xe đối diện có thể đổi làn để tiến vào nên cẩn thận." },
    { textVi: "Vì công nhân có thể bất ngờ chạy ra từ công trường nên cẩn thận." },
    { textVi: "Khi đi qua bên cạnh công trường thì giảm tốc độ để đi qua an toàn." },
  ],
  // 11_10 (index 9)
  [
    { textVi: "Vì người đi bộ phía trước sẽ không qua đường nên không cần giảm tốc." },
    { textVi: "Có biển báo đường đến trường nhưng không thấy trẻ nhỏ nên không cần chú ý đặc biệt." },
    { textVi: "Xe đạp phía trước cách đủ xa nên không cần chú ý đặc biệt." },
  ],
  // 11_11 (index 10)
  [
    { textVi: "Để lên hết dốc nên tăng tốc độ để đỡ vất vả." },
    { textVi: "Vì không thấy xe đối diện nên đi gần giữa đường." },
    { textVi: "Dù có xe phía sau, nhưng vì gần đỉnh dốc lên dốc nên giảm tốc độ, chạy chậm để tiến vào." },
  ],
  // 11_12 (index 11)
  [
    { textVi: "Vì có thể có xe từ bên trái nên cẩn thận đi thẳng." },
    { textVi: "Vì người đi bộ qua đường được ưu tiên nên đợi người đi bộ qua đường." },
    { textVi: "Vì người có thể bất ngờ chạy ra từ bóng xe tải nên giảm tốc độ để tiến vào." },
  ],
  // 11_13 (index 12)
  [
    { textVi: "Vì trẻ đang chơi nên giảm tốc độ để tiến vào." },
    { textVi: "Để nhắc nhở trẻ chú ý nên sử dụng còi." },
    { textVi: "Chú ý đến việc trẻ có thể bất ngờ chạy ra đuổi bóng để tiến vào." },
  ],
  // 11_14 (index 13)
  [
    { textVi: "Để không làm bắn nước lên người đi bộ nên giảm tốc độ lái xe." },
    { textVi: "Vì trẻ đã nhận ra xe nên không cần chú ý đặc biệt." },
    { textVi: "Vì có thể bị xe phía sau đâm từ phía sau nên tăng tốc độ một chút để lái xe." },
  ],
  // 11_15 (index 14)
  [
    { textVi: "Vì không cảm thấy nguy hiểm nên không bấm còi mà tiến vào." },
    { textVi: "Vì có thể có xe đối diện nên giảm tốc độ." },
    { textVi: "Vì công nhân có thể bất ngờ chạy ra từ công trường nên cẩn thận để tiến vào." },
  ],
  // 11_16 (index 15)
  [
    { textVi: "Vì người đi bộ qua đường có vẻ như sẽ dừng lại nên rẽ trái gấp." },
    { textVi: "Dù xe phía sau muốn đi thẳng, vẫn dừng lại và ưu tiên người đi bộ qua đường." },
    { textVi: "Để xe đạp không bất ngờ lao ra nên bấm còi để cảnh báo." },
  ],
  // 11_17 (index 16)
  [
    { textVi: "Vì có xe phía sau nên khi giảm tốc thì phanh nhiều lần chia nhỏ." },
    { textVi: "Vì công nhân có thể bất ngờ chạy ra từ công trường nên cẩn thận để đi qua." },
    { textVi: "Nhường xe đối diện đi trước." },
  ],
  // 11_18 (index 17)
  [
    { textVi: "Khi vượt xe đỗ thì đợi xe đối diện đi qua rồi mới vượt." },
    { textVi: "Vì đường cong nên giảm tốc độ để đi qua." },
    { textVi: "Để không cản trở giao thông nên tăng tốc độ vượt xe đỗ một hơi." },
  ],
  // 11_19 (index 18)
  [
    { textVi: "Để tiến lên phía trước một chút nên đi vào ngã tư rồi dừng lại." },
    { textVi: "Để tránh dừng trong ngã tư nên không cố đi vào ngã tư mà dừng tại chỗ." },
    { textVi: "Vì không có xe đối diện nên vượt xe để tiến vào." },
  ],
  // 11_20 (index 19)
  [
    { textVi: "Vì có xe đối diện nên đi sát bên trái một chút." },
    { textVi: "Vì đường cong dốc lên có nhiều nguy hiểm nên tăng tốc độ để đi qua nhanh." },
    { textVi: "Để tránh không đi qua đường cong được nên đi sát vạch giữa đường." },
  ],
  // 11_21 (index 20)
  [
    { textVi: "Vì trẻ đã được dạy ở trường là không được lao ra đường nên không cần chú ý đặc biệt." },
    { textVi: "Vì xe đối diện đi thẳng được ưu tiên nên dừng lại đợi." },
    { textVi: "Để xe phía sau cũng đi thuận lợi nên rẽ phải gấp ở ngã tư." },
  ],
  // 11_22 (index 21)
  [
    { textVi: "Để đi qua bên cạnh taxi trước xe đối diện nên thay đổi làn đường gấp." },
    { textVi: "Đợi xe đối diện đi qua rồi mới vượt taxi đỗ." },
    { textVi: "Khi vượt taxi đỗ thì cũng chú ý taxi có thể bất ngờ chạy." },
  ],
  // 11_23 (index 22)
  [
    { textVi: "Dừng xe trước đường bộ nhỏ, xác định an toàn bằng mắt và tai." },
    { textVi: "Khi qua đường bộ nhỏ, để tránh va chạm với xe đối diện, đi gần mép đường bộ nhỏ." },
    { textVi: "Khi qua đường bộ nhỏ, để tránh lệch bánh, đi gần giữa đường bộ nhỏ." },
  ],
  // 11_24 (index 23)
  [
    { textVi: "Chú ý người có thể bất ngờ chạy ra từ bóng xe đỗ." },
    { textVi: "Vì người đi bộ phía trước không có vẻ sẽ qua đường nên nghĩ là không qua đường, rồi tăng tốc." },
    { textVi: "Chú ý trẻ phía trước có thể bất ngờ chạy ra để tiến vào." },
  ],
  // 11_25 (index 24)
  [
    { textVi: "Vì có xe phía sau nên khi giảm tốc thì phanh nhiều lần chia nhỏ." },
    { textVi: "Vì nguy hiểm nên không được thay đổi làn đường gấp để vượt taxi." },
    { textVi: "Đợi xe đối diện đi qua rồi mới vượt taxi thì tốt." },
  ],
  // 11_26 (index 25)
  [
    { textVi: "Vì phía trước có người đi bộ qua đường nên ưu tiên." },
    { textVi: "Vì người đi bộ qua đường không nhận ra xe mình nên bấm còi để nhắc nhở." },
    { textVi: "Khi dừng lại thì phanh nhiều lần chia nhỏ để xe phía sau không bị đâm." },
  ],
  // 11_27 (index 26)
  [
    { textVi: "Để không đâm xe hai bánh nên tăng tốc rẽ phải." },
    { textVi: "Vì xe máy nhìn gần hơn thực tế nên cần chú ý." },
    { textVi: "Sau khi xe máy đi rồi, vì có xe phía sau nên vẫn cần chú ý." },
  ],
  // 11_28 (index 27)
  [
    { textVi: "Xe đối diện đã bắt đầu rẽ phải trước nhưng vì mình được ưu tiên nên rẽ trái." },
    { textVi: "Chú ý người đi bộ và xe đối diện, xác nhận an toàn rồi rẽ trái." },
    { textVi: "Chú ý không quay vòng quá lớn." },
  ],
  // 11_29 (index 28)
  [
    { textVi: "Tính đến việc taxi giảm tốc để đón khách." },
    { textVi: "Để không đâm vào taxi nên sớm thay đổi làn đường bằng lái gấp." },
    { textVi: "Vì xe phía sau đang cố vượt taxi nên giảm tốc." },
  ],
  // 11_30 (index 29)
  [
    { textVi: "Ban đêm đèn xe đối diện chói mắt, gây hiện tượng chói mắt nên nhìn sang trái phía trước." },
    { textVi: "Ban đêm giao thông ít nên tăng tốc độ hơn ban ngày để tiến vào." },
    { textVi: "Không đi giữa đường mà đi bên trái." },
  ],
];

// Apply translations
let updated = 0;

for (let i = 0; i < data.dangerScenarioGroups.length; i++) {
  const group = data.dangerScenarioGroups[i];

  // stem
  if (group.stemVi === null && stemTranslations[i]) {
    group.stemVi = stemTranslations[i];
    updated++;
  }

  // subs
  const subs = subTranslations[i];
  if (subs) {
    for (let j = 0; j < group.subs.length; j++) {
      const sub = group.subs[j];
      const tr = subs[j];
      if (tr) {
        if (tr.textVi !== undefined && sub.textVi === null) {
          sub.textVi = tr.textVi;
          updated++;
        }
        if (tr.explanationVi !== undefined && sub.explanationVi === null) {
          sub.explanationVi = tr.explanationVi;
          updated++;
        }
      }
    }
  }
}

fs.writeFileSync(IN, JSON.stringify(data, null, 2), "utf8");
console.log(`Updated ${updated} translations in dangerScenarioGroups`);
