// Translate all missing Vietnamese translations in questions.merged.json - manual translations
// 2 simple questions + 30 stems + 90 sub-texts
import fs from 'fs';

const filePath = 'app/data/questions.merged.json';
const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

// ──────────────────────────────────────────────
// MANUAL TRANSLATIONS
// ──────────────────────────────────────────────

const translations = {

  // ── 2 Simple questions ──────────────────────
  'menkyogentsuki_gentsuki_6_12_4': {
    textVi: 'Do xảy ra tai nạn giao thông nên đã dừng xe ở nơi an toàn, sau khi cấp cứu người bị thương và thực hiện biện pháp phòng ngừa tai nạn tiếp theo, đã báo cảnh sát.',
    explanationVi: 'Đúng. Không được rời khỏi hiện trường mà không thực hiện những biện pháp này.',
  },
  'menkyogentsuki_gentsuki_6_12_5': {
    textVi: 'Xe có thể đi qua vùng an toàn khi không có người đi bộ.',
    explanationVi: 'Dù có hay không có người đi bộ thì cũng không được đi qua.',
  },

  // ── 30 Scenario stems ──────────────────────
  '危険予測【イラスト問題】::11_1': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Làn đường của mình đang kẹt xe. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_2': {
    stemVi: 'Đang chạy trên đường cua với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_3': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_4': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_5': {
    stemVi: 'Đang chạy với tốc độ 5 km/h. Khi rẽ trái ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_6': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Khi rẽ phải ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_7': {
    stemVi: 'Đang chạy vào ban đêm với tốc độ 10 km/h. Khi rẽ phải ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_8': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_9': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_10': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_11': {
    stemVi: 'Đang chạy gần đỉnh dốc với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_12': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Khi đi thẳng qua ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_13': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_14': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_15': {
    stemVi: 'Đang chạy trên đường cua với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_16': {
    stemVi: 'Đang chạy vào ban đêm với tốc độ 10 km/h. Khi rẽ trái ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_17': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_18': {
    stemVi: 'Đang chạy trên đường cua với tốc độ 30 km/h. Phía trước có xe đang đỗ. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_19': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Phía trước đang kẹt xe. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_20': {
    stemVi: 'Đang chạy trên đường cua dốc với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_21': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Khi rẽ phải ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_22': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Phía trước có taxi đang dừng. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_23': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_24': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Phía trước có xe đang đỗ. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_25': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Phía trước có taxi đang dừng. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_26': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Khi đi thẳng qua ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_27': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Khi rẽ phải ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_28': {
    stemVi: 'Đang chạy với tốc độ 10 km/h. Khi rẽ trái ở ngã tư, cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_29': {
    stemVi: 'Đang chạy với tốc độ 30 km/h. Cần chú ý điều gì?',
  },
  '危険予測【イラスト問題】::11_30': {
    stemVi: 'Đang chạy vào ban đêm với tốc độ 30 km/h. Cần chú ý điều gì?',
  },

  // ── 90 Scenario sub-texts ──────────────────
  // 11_1 subs
  'menkyogentsuki_gentsuki_11_1_1': { textVi: 'Di chuyển về phía trái đường, tăng tốc độ để đi qua.' },
  'menkyogentsuki_gentsuki_11_1_2': { textVi: 'Để nhanh chóng thoát khỏi kẹt xe, di chuyển giữa các hàng xe.' },
  'menkyogentsuki_gentsuki_11_1_3': { textVi: 'Khi kẹt xe, giảm tốc độ, quan sát an toàn xung quanh rồi di chuyển.' },
  // 11_2 subs
  'menkyogentsuki_gentsuki_11_2_1': { textVi: 'Xe hai bánh ít bị mất thăng bằng khi vào cua nên không cần chú ý đặc biệt.' },
  'menkyogentsuki_gentsuki_11_2_2': { textVi: 'Xe hai bánh chạy chậm và không thấy xe đối diện nên đã vượt an toàn.' },
  'menkyogentsuki_gentsuki_11_2_3': { textVi: 'Đi sát về phía trái, giảm tốc độ rồi đi qua đường cua.' },
  // 11_3 subs
  'menkyogentsuki_gentsuki_11_3_1': { textVi: 'Xe phía trước đã đi nên cho rằng an toàn, tiếp tục đi thẳng.' },
  'menkyogentsuki_gentsuki_11_3_2': { textVi: 'Dừng trước đường sắt, quan sát bằng mắt và tai để xác định an toàn.' },
  'menkyogentsuki_gentsuki_11_3_3': { textVi: 'Khi qua đường sắt, để tránh va chạm với xe đối diện, đi phần gần mép đường sắt.' },
  // 11_4 subs
  'menkyogentsuki_gentsuki_11_4_1': { textVi: 'Ngày mưa thì dù làm ướt người đi bộ cũng không sao.' },
  'menkyogentsuki_gentsuki_11_4_2': { textVi: 'Có nguy cơ người đi bộ không nghe thấy xe vì tiếng mưa, nên cẩn thận lái xe.' },
  'menkyogentsuki_gentsuki_11_4_3': { textVi: 'Có nguy cơ người đi bộ cúi mặt xuống không nhận ra xe, nên cẩn thận lái xe.' },
  // 11_5 subs
  'menkyogentsuki_gentsuki_11_5_1': { textVi: 'Trước khi người đi bộ và xe tải rẽ trái, tăng tốc độ để rẽ trái.' },
  'menkyogentsuki_gentsuki_11_5_2': { textVi: 'Có nguy cơ bị cuốn vào khi rẽ cùng xe tải, nên ở vị trí này phanh lại, chờ xe tải rẽ trái.' },
  'menkyogentsuki_gentsuki_11_5_3': { textVi: 'Xe tải dừng đột ngột, đã đảm bảo lộ trình nên nhanh chóng rẽ trái.' },
  // 11_6 subs
  'menkyogentsuki_gentsuki_11_6_1': { textVi: 'Người đi bộ có vẻ sẽ dừng lại nên đã rẽ phải.' },
  'menkyogentsuki_gentsuki_11_6_2': { textVi: 'Có nguy cơ xe hai bánh đi thẳng từ phía sau xe buýt, nên chú ý.' },
  'menkyogentsuki_gentsuki_11_6_3': { textVi: 'Xe buýt rẽ phải nên cho rằng ngã tư đã an toàn, nhanh chóng rẽ phải.' },
  // 11_7 subs
  'menkyogentsuki_gentsuki_11_7_1': { textVi: 'Có xe đối diện nên chuyển đèn pha xuống chế độ thấp rồi tiến vào.' },
  'menkyogentsuki_gentsuki_11_7_2': { textVi: 'Sau khi người đi bộ qua đường thì không còn nguy hiểm, nên nhanh chóng rẽ phải.' },
  'menkyogentsuki_gentsuki_11_7_3': { textVi: 'Người đi bộ qua đường có ưu tiên trước tiên.' },
  // 11_8 subs
  'menkyogentsuki_gentsuki_11_8_1': { textVi: 'Có thể công nhân bước ra từ công trường nên chú ý khi đi qua.' },
  'menkyogentsuki_gentsuki_11_8_2': { textVi: 'Có xe phía sau nên khi giảm tốc thì phanh nhiều lần.' },
  'menkyogentsuki_gentsuki_11_8_3': { textVi: 'Khi chuyển làn, không chỉ nhìn gương mà còn quan sát trực tiếp để xác nhận an toàn.' },
  // 11_9 subs
  'menkyogentsuki_gentsuki_11_9_1': { textVi: 'Xe đối diện có thể chuyển làn nên chú ý.' },
  'menkyogentsuki_gentsuki_11_9_2': { textVi: 'Có thể công nhân bước ra từ công trường nên chú ý.' },
  'menkyogentsuki_gentsuki_11_9_3': { textVi: 'Khi đi qua công trường, giảm tốc độ và đi qua để đảm bảo an toàn.' },
  // 11_10 subs
  'menkyogentsuki_gentsuki_11_10_1': { textVi: 'Người đi bộ phía trước sẽ không băng qua đường nên không cần giảm tốc.' },
  'menkyogentsuki_gentsuki_11_10_2': { textVi: 'Có biển báo khu vực đưa đón học sinh nhưng không thấy trẻ em nên không cần chú ý đặc biệt.' },
  'menkyogentsuki_gentsuki_11_10_3': { textVi: 'Xe đạp phía trước ở khoảng cách đủ xa nên không cần chú ý đặc biệt.' },
  // 11_11 subs
  'menkyogentsuki_gentsuki_11_11_1': { textVi: 'Để leo lên dốc nên tăng tốc độ để đi lên.' },
  'menkyogentsuki_gentsuki_11_11_2': { textVi: 'Không thấy xe đối diện nên đi về phía giữa đường.' },
  'menkyogentsuki_gentsuki_11_11_3': { textVi: 'Có xe phía sau nhưng ở gần đỉnh dốc nên giảm tốc độ, đi chậm.' },
  // 11_12 subs
  'menkyogentsuki_gentsuki_11_12_1': { textVi: 'Người đi bộ có vẻ sẽ dừng lại nên đi thẳng qua.' },
  'menkyogentsuki_gentsuki_11_12_2': { textVi: 'Có nguy cơ trẻ em chạy ra bất ngờ từ phía trước xe tải đang dừng, nên giảm tốc độ.' },
  'menkyogentsuki_gentsuki_11_12_3': { textVi: 'Người đi bộ đang đợi nên không cần chú ý đặc biệt, tiếp tục đi.' },
  // 11_13 subs
  'menkyogentsuki_gentsuki_11_13_1': { textVi: 'Đường vắng nên tăng tốc độ để đi qua.' },
  'menkyogentsuki_gentsuki_11_13_2': { textVi: 'Có nguy cơ người đi bộ đột ngột băng qua từ phía sau xe đang đỗ, nên chú ý.' },
  'menkyogentsuki_gentsuki_11_13_3': { textVi: 'Có nguy cơ người đi bộ đi ra từ phía trước xe đang đỗ, nên chú ý.' },
  // 11_14 subs
  'menkyogentsuki_gentsuki_11_14_1': { textVi: 'Có nguy cơ người đi bộ đi ra từ phía bên kia đường, nên chú ý.' },
  'menkyogentsuki_gentsuki_11_14_2': { textVi: 'Có nguy cơ xe đối diện đi ra từ con hẻm bên phải, nên chú ý.' },
  'menkyogentsuki_gentsuki_11_14_3': { textVi: 'Có nguy cơ xe đối diện đi ra từ con hẻm bên trái, nên chú ý.' },
  // 11_15 subs
  'menkyogentsuki_gentsuki_11_15_1': { textVi: 'Xe đối diện có vẻ sẽ nhường đường nên rẽ phải.' },
  'menkyogentsuki_gentsuki_11_15_2': { textVi: 'Người đi bộ có vẻ sẽ dừng lại nên rẽ phải.' },
  'menkyogentsuki_gentsuki_11_15_3': { textVi: 'Người đi bộ không có vẻ sẽ băng qua nên giảm tốc độ và rẽ phải.' },
  // 11_16 subs
  'menkyogentsuki_gentsuki_11_16_1': { textVi: 'Có nguy cơ người đi bộ băng qua từ phía bên phải, nên chú ý.' },
  'menkyogentsuki_gentsuki_11_16_2': { textVi: 'Có nguy cơ xe đối diện đi thẳng qua ngã tư, nên chú ý.' },
  'menkyogentsuki_gentsuki_11_16_3': { textVi: 'Có nguy cơ người đi bộ băng qua từ phía bên trái, nên chú ý.' },
  // 11_17 subs
  'menkyogentsuki_gentsuki_11_17_1': { textVi: 'Đường vắng nên đi thẳng qua đường sắt mà không dừng.' },
  'menkyogentsuki_gentsuki_11_17_2': { textVi: 'Dừng trước đường sắt, quan sát bằng mắt và tai để xác định an toàn.' },
  'menkyogentsuki_gentsuki_11_17_3': { textVi: 'Khi qua đường sắt, đi phần giữa đường sắt để tránh trượt bánh.' },
  // 11_18 subs
  'menkyogentsuki_gentsuki_11_18_1': { textVi: 'Xe tải đang quay đầu nên đi nhanh qua trước.' },
  'menkyogentsuki_gentsuki_11_18_2': { textVi: 'Có nguy cơ bị cuốn vào khi xe tải quay đầu, nên chờ và quan sát.' },
  'menkyogentsuki_gentsuki_11_18_3': { textVi: 'Xe tải có vẻ đã dừng nên đi qua.' },
  // 11_19 subs
  'menkyogentsuki_gentsuki_11_19_1': { textVi: 'Để tiến lên phía trước một chút, đi vào ngã tư rồi dừng lại.' },
  'menkyogentsuki_gentsuki_11_19_2': { textVi: 'Để tránh bị kẹt trong ngã tư, không cố đi vào ngã tư mà dừng lại tại chỗ.' },
  'menkyogentsuki_gentsuki_11_19_3': { textVi: 'Không thấy xe đối diện nên vượt qua và tiến lên.' },
  // 11_20 subs
  'menkyogentsuki_gentsuki_11_20_1': { textVi: 'Có xe đối diện nên đi hơi về phía trái.' },
  'menkyogentsuki_gentsuki_11_20_2': { textVi: 'Đường cua dốc lên có nhiều nguy hiểm nên tăng tốc để qua nhanh.' },
  'menkyogentsuki_gentsuki_11_20_3': { textVi: 'Để tránh không thể quay cua, đi về phía vạch giữa đường.' },
  // 11_21 subs
  'menkyogentsuki_gentsuki_11_21_1': { textVi: 'Trẻ em đã được dạy không được chạy ra đường nên không cần chú ý đặc biệt.' },
  'menkyogentsuki_gentsuki_11_21_2': { textVi: 'Xe đối diện đi thẳng có ưu tiên nên dừng lại đợi.' },
  'menkyogentsuki_gentsuki_11_21_3': { textVi: 'Để xe phía sau cũng đi qua thuận tiện, nhanh chóng rẽ phải qua ngã tư.' },
  // 11_22 subs
  'menkyogentsuki_gentsuki_11_22_1': { textVi: 'Để đi qua trước xe đối diện, nhanh chóng chuyển làn qua bên xe taxi.' },
  'menkyogentsuki_gentsuki_11_22_2': { textVi: 'Chờ xe đối diện đi qua rồi mới vượt xe taxi đang dừng.' },
  'menkyogentsuki_gentsuki_11_22_3': { textVi: 'Khi vượt xe taxi đang dừng, cũng cần chú ý xe taxi có thể đột ngột chạy.' },
  // 11_23 subs
  'menkyogentsuki_gentsuki_11_23_1': { textVi: 'Dừng trước đường sắt, quan sát bằng mắt và tai để xác định an toàn.' },
  'menkyogentsuki_gentsuki_11_23_2': { textVi: 'Khi qua đường sắt, để tránh va chạm với xe đối diện, đi phần gần mép đường sắt.' },
  'menkyogentsuki_gentsuki_11_23_3': { textVi: 'Khi qua đường sắt, để tránh trượt bánh, đi phần gần giữa đường sắt.' },
  // 11_24 subs
  'menkyogentsuki_gentsuki_11_24_1': { textVi: 'Chú ý người có thể bước ra bất ngờ từ phía sau xe đang đỗ.' },
  'menkyogentsuki_gentsuki_11_24_2': { textVi: 'Người đi bộ phía trước không có vẻ sẽ băng qua đường nên tăng tốc độ.' },
  'menkyogentsuki_gentsuki_11_24_3': { textVi: 'Chú ý trẻ em có thể bước ra bất ngờ rồi tiến lên.' },
  // 11_25 subs
  'menkyogentsuki_gentsuki_11_25_1': { textVi: 'Khi giảm tốc thì có xe phía sau nên phanh nhiều lần.' },
  'menkyogentsuki_gentsuki_11_25_2': { textVi: 'Rất nguy hiểm, không được đột ngột chuyển làn để vượt taxi.' },
  'menkyogentsuki_gentsuki_11_25_3': { textVi: 'Nên chờ xe đối diện đi qua rồi mới vượt taxi.' },
  // 11_26 subs
  'menkyogentsuki_gentsuki_11_26_1': { textVi: 'Có người đi bộ phía trước nên được ưu tiên.' },
  'menkyogentsuki_gentsuki_11_26_2': { textVi: 'Người đi bộ không nhận ra xe nên bấm còi để cảnh báo.' },
  'menkyogentsuki_gentsuki_11_26_3': { textVi: 'Khi dừng lại thì phanh nhiều lần để xe phía sau không bị đâm.' },
  // 11_27 subs
  'menkyogentsuki_gentsuki_11_27_1': { textVi: 'Để tránh va chạm với xe hai bánh, tăng tốc độ rẽ phải.' },
  'menkyogentsuki_gentsuki_11_27_2': { textVi: 'Xe máy có vẻ ở gần hơn thực tế nên cần chú ý.' },
  'menkyogentsuki_gentsuki_11_27_3': { textVi: 'Sau khi xe máy đi qua, vẫn cần chú ý vì có xe phía sau.' },
  // 11_28 subs
  'menkyogentsuki_gentsuki_11_28_1': { textVi: 'Xe đối diện đã bắt đầu rẽ phải trước nhưng mình có ưu tiên nên rẽ trái.' },
  'menkyogentsuki_gentsuki_11_28_2': { textVi: 'Chú ý người đi bộ và xe đối diện, xác nhận an toàn rồi rẽ trái.' },
  'menkyogentsuki_gentsuki_11_28_3': { textVi: 'Chú ý không vượt quá rộng khi quẹo.' },
  // 11_29 subs
  'menkyogentsuki_gentsuki_11_29_1': { textVi: 'Cân nhắc việc taxi giảm tốc để đón khách.' },
  'menkyogentsuki_gentsuki_11_29_2': { textVi: 'Để tránh đâm vào taxi, nên chuyển làn đột ngột bằng tay lái nhanh.' },
  'menkyogentsuki_gentsuki_11_29_3': { textVi: 'Xe phía sau đang cố vượt taxi nên giảm tốc độ.' },
  // 11_30 subs
  'menkyogentsuki_gentsuki_11_30_1': { textVi: 'Ban đêm đèn xe đối diện chói mắt, gây hiện tượng chói mắt nên nhìn phía trước bên trái.' },
  'menkyogentsuki_gentsuki_11_30_2': { textVi: 'Ban đêm giao thông ít nên tăng tốc độ để đi qua hơn ban ngày.' },
  'menkyogentsuki_gentsuki_11_30_3': { textVi: 'Không đi giữa đường mà đi về phía trái.' },
};

// ──────────────────────────────────────────────
// APPLY TRANSLATIONS
// ──────────────────────────────────────────────

let applied = 0;

function applyTranslations() {
  // Simple questions
  for (const q of data.simple) {
    if (q.id in translations) {
      const t = translations[q.id];
      if (t.textVi) q.textVi = t.textVi;
      if (t.explanationVi) q.explanationVi = t.explanationVi;
      applied++;
    }
  }

  // Scenario groups
  for (const g of [...data.scenarioGroups, ...data.dangerScenarioGroups]) {
    // Stem
    if (g.groupId in translations) {
      const t = translations[g.groupId];
      if (t.stemVi && !g.stemVi) {
        g.stemVi = t.stemVi;
        applied++;
      }
    }

    // Sub-texts
    for (const s of g.subs) {
      if (s.partId in translations) {
        const t = translations[s.partId];
        if (t.textVi && !s.textVi) {
          s.textVi = t.textVi;
          applied++;
        }
      }
    }
  }
}

applyTranslations();

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Đã áp dụng ${applied} bản dịch.`);

// Verify
let mt=0, me=0, ms=0, mss=0;
for(const q of data.simple){ if(!q.textVi)mt++; if(!q.explanationVi)me++; }
for(const g of [...data.scenarioGroups,...data.dangerScenarioGroups]){
  if(!g.stemVi)ms++;
  for(const s of g.subs){ if(!s.textVi)mss++; }
}
console.log(`Còn thiếu: textVi=${mt}, expVi=${me}, stemVi=${ms}, subTextVi=${mss}`);
