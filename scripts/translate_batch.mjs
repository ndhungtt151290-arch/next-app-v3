// Batch 10: gentsuki_8_29 → gentsuki_9_6
import fs from 'fs';

const filePath = 'app/data/questions.vi.json';
const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

const translations = {
  'menkyogentsuki_gentsuki_8_29_1': 'Trên đường sỏi, quãng đường để xe dừng lại cần thiết sẽ dài hơn, nên cần chú ý.',
  'menkyogentsuki_gentsuki_8_29_2': 'Khác với trong giao lộ và gần giao lộ, ở những nơi khác, chỉ cần đi sát phía bên trái của đường và nhường đường, không cần dừng lại một lần.',
  'menkyogentsuki_gentsuki_8_29_3': 'Đối với xe đi theo hướng đông-tây thì có ý nghĩa tương đương tín hiệu đỏ.',
  'menkyogentsuki_gentsuki_8_29_4': 'Dù là rẽ phải hai giai đoạn cũng cần bật xi nhan rẽ phải tại cùng điểm như rẽ phải thông thường.',
  'menkyogentsuki_gentsuki_8_29_5': 'Ban ngày tùy theo tình trạng đường cũng có thể cần bật đèn. Cụ thể, trong hầm, nơi có sương mù dày đặc v.v... khi tầm nhìn dưới 50 mét thì dù ban ngày cũng phải bật đèn.',
  'menkyogentsuki_gentsuki_8_30_1': 'Việc giữ khoảng cách giữa các xe thật chắc chắn là rất quan trọng.',
  'menkyogentsuki_gentsuki_8_30_2': 'Hãy cố gắng giữ khoảng cách giữa các xe bằng quãng đường dừng.',
  'menkyogentsuki_gentsuki_8_30_3': 'Khi đi qua chỗ có trẻ em đi một mình thì phải giảm tốc độ hoặc dừng lại một lần rồi mới đi qua. Trong câu hỏi này, đang giảm tốc độ để đi qua chỗ có trẻ em. Do đó mô tả trong đề bài là đúng.',
  'menkyogentsuki_gentsuki_8_30_4': 'Phần "3 mét" là sai. Đúng ra phải là trong phạm vi 5 mét.',
  'menkyogentsuki_gentsuki_8_30_5': 'Đó là tín hiệu giảm tốc độ hoặc dừng xe.',
  'menkyogentsuki_gentsuki_9_1_1': 'Nên giảm tốc độ trước đoạn bùn và giữ tốc độ ổn định để đi qua.',
  'menkyogentsuki_gentsuki_9_1_2': 'Nếu đổi làn đường thì đó là vượt xe.',
  'menkyogentsuki_gentsuki_9_1_3': 'Nếu có tín hiệu đỏ thì phải dừng tại vị trí dừng.',
  'menkyogentsuki_gentsuki_9_1_4': 'Ban đêm xung quanh tối, tầm nhìn kém, nên phải giảm tốc độ khi lái xe.',
  'menkyogentsuki_gentsuki_9_1_5': 'Giữ làn bên phải trống để vượt xe hay rẽ phải, về nguyên tắc đi làn bên trái.',
  'menkyogentsuki_gentsuki_9_2_1': 'Hãy chuyển sang số thấp và đi qua từ từ.',
  'menkyogentsuki_gentsuki_9_2_2': 'Không đúng. Khi gây tai nạn giao thông, trước tiên phải dừng xe ở nơi an toàn, thực hiện các biện pháp cứu người bị thương và phòng ngừa tai nạn tiếp diễn, rồi báo cảnh sát.',
  'menkyogentsuki_gentsuki_9_2_3': 'Việc vượt hay đuổi kịp xe có dán biển người mới không bị cấm đặc biệt.',
  'menkyogentsuki_gentsuki_9_2_4': 'Không được kết luận là không có tàu, nhất thiết phải dừng lại một lần và xác nhận an toàn.',
  'menkyogentsuki_gentsuki_9_2_5': 'Khi có tín hiệu vàng nhấp nháy, chỉ cần xác nhận an toàn và đi qua, không có nghĩa vụ giảm tốc độ.',
  'menkyogentsuki_gentsuki_9_3_1': 'Ủng đế dày cũng rất nguy hiểm. Giày thể thao là loại phù hợp nhất.',
  'menkyogentsuki_gentsuki_9_3_2': 'Phải di chuyển xe ra ngoài khu vực đó.',
  'menkyogentsuki_gentsuki_9_3_3': 'Chỉ được bấm còi trong những trường hợp bất khả kháng như để tránh nguy hiểm.',
  'menkyogentsuki_gentsuki_9_3_4': 'Tín hiệu xi nhan nên được tắt ngay sau khi hoàn thành hành động.',
  'menkyogentsuki_gentsuki_9_3_5': 'Hãy nhớ rằng màu vàng là cấm lấn làn.',
  'menkyogentsuki_gentsuki_9_4_1': 'Hãy đi trên cùng một làn đường.',
  'menkyogentsuki_gentsuki_9_4_2': 'Biển chỉ dẫn này thể hiện phương pháp rẽ phải, cho biết phần mà xe phải đi qua khi rẽ phải tại giao lộ.',
  'menkyogentsuki_gentsuki_9_4_3': 'Khi có người đi bộ đang qua vạch qua đường thì phải dừng lại một lần và không được cản trở người đi bộ.',
  'menkyogentsuki_gentsuki_9_4_4': 'Khi vượt xe điện đường phố, về nguyên tắc đi qua bên trái của nó. Tuy nhiên, ngoại lệ khi đường ray của xe điện ở mép trái của đường thì đi qua bên phải.',
  'menkyogentsuki_gentsuki_9_4_5': 'Đây là làn đường chỉ dành cho rẽ trái nên không thể đi thẳng hay rẽ phải.',
  'menkyogentsuki_gentsuki_9_5_1': 'Dù là xe gắn máy cũng không được phép đi trên đường dành cho người đi bộ.',
  'menkyogentsuki_gentsuki_9_5_2': 'Biển báo này là biển cấm đi theo hướng không được chỉ định, rẽ phải bị cấm.',
  'menkyogentsuki_gentsuki_9_5_3': 'Chỉ trong thời gian được chỉ định mới trở thành làn dành riêng cho xe buýt tuyến v.v...',
  'menkyogentsuki_gentsuki_9_5_4': 'Để xe đối diện và xe khác không bị chói mắt, hãy chuyển đèn pha sang chế độ thấp hoặc giảm độ sáng đèn.',
  'menkyogentsuki_gentsuki_9_5_5': 'Khi bánh sau bị trượt sang phải thì quay vô lăng sang phải.',
  'menkyogentsuki_gentsuki_9_6_1': 'Không đúng. Xe gắn máy về nguyên tắc phải đi trên làn ngoài cùng bên trái, dù có nhiều làn đường.',
  'menkyogentsuki_gentsuki_9_6_2': 'Giao thông song song với mặt trước của cảnh sát là tín hiệu xanh.',
  'menkyogentsuki_gentsuki_9_6_3': 'Dừng xe không bị cấm đặc biệt.',
  'menkyogentsuki_gentsuki_9_6_4': 'Đúng. Trên đường như thế này, nếu vạch giữa không phải vạch vàng thì được phép vượt bằng cách lấn sang bên phải. Tuy nhiên, không được cản trở xe đối diện.',
  'menkyogentsuki_gentsuki_9_6_5': 'Xe gắn máy cũng nhất thiết phải gắn biển số.',
};

function walkAndUpdate(obj) {
  let updated = 0;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (item.id && translations[item.id] !== undefined && item.explanationVi === null) {
          item.explanationVi = translations[item.id];
          updated++;
        }
      }
      updated += walkAndUpdate(item);
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      updated += walkAndUpdate(obj[key]);
    }
  }
  return updated;
}

const totalUpdated = walkAndUpdate(data);
console.log(`Đã cập nhật: ${totalUpdated} câu`);

let nullCnt = 0;
function countNull(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object' && !Array.isArray(item) && item.explanationVi === null) nullCnt++;
      countNull(item);
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) countNull(obj[key]);
  }
}
countNull(data);
console.log(`Còn lại: ${nullCnt} câu chưa dịch`);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Đã lưu file!');
