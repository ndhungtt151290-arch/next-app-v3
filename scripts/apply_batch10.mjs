// Script để cập nhật explanationVi - Batch 10
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 10
const translations = {
  "menkyogentsuki_gentsuki_6_12_4": "Đúng. Không được rời khỏi hiện trường mà không thực hiện các biện pháp này.",
  "menkyogentsuki_gentsuki_6_12_5": "Bất kể có người đi bộ hay không, đều không thể lưu thông.",
  "menkyogentsuki_gentsuki_7_19_1": "Vì người đi bộ lưu thông, phải chừa khoảng cách 0,75 mét.",
  "menkyogentsuki_gentsuki_7_19_2": "Khi tránh nguy hiểm bất đắc dĩ thì có thể bấm còi.",
  "menkyogentsuki_gentsuki_7_19_3": "Đèn chiếu sáng phía trước không chỉ để mình nhìn mà còn để người khác nhìn thấy mình, vì vậy ban đêm bắt buộc phải bật.",
  "menkyogentsuki_gentsuki_7_19_4": "Vì khi phanh trong đường cong có thể bị trượt và lật.",
  "menkyogentsuki_gentsuki_7_19_5": "Đúng. Trong trường hợp như hình minh họa này, không thể vượt xe bằng cách lấn sang phải từ A sang B, nhưng có thể vượt xe bằng cách lấn sang phải từ B sang A.",
  "menkyogentsuki_gentsuki_7_20_1": "Khi có xe đối diện, hạ đèn chiếu sáng phía trước xuống.",
  "menkyogentsuki_gentsuki_7_20_2": "Để phòng ngừa nguy hiểm, việc sử dụng còi cũng rất quan trọng.",
  "menkyogentsuki_gentsuki_7_20_3": "Vì để mọi người có thể di chuyển được.",
  "menkyogentsuki_gentsuki_7_20_4": "Vì gây tiếng ồn, không được lái xe khi ống xả bị hỏng.",
  "menkyogentsuki_gentsuki_7_20_5": "Vì có thể có di chứng dù không có vết thương bên ngoài.",
  "menkyogentsuki_gentsuki_7_21_1": "Dù ngay sau khi rào chắn được nâng lên, cũng phải dừng lại một lần và xác nhận an toàn rồi mới khởi hành.",
  "menkyogentsuki_gentsuki_7_21_2": "Đi sát về phía trái của đường, nhường đường cho xe phía sau.",
  "menkyogentsuki_gentsuki_7_21_3": "Vì gần đỉnh dốc, không biết có gì ở phía bên kia đỉnh dốc.",
  "menkyogentsuki_gentsuki_7_21_4": "Làn đường của xe A là đường ưu tiên.",
  "menkyogentsuki_gentsuki_7_21_5": "Đúng. Biển báo này cho biết biển đi bên phải, khi có biển báo này, xe có thể đi bên phải của đường trong khi chú ý xe đối diện.",
  "menkyogentsuki_gentsuki_7_22_1": "Đèn vàng nhấp nháy có nghĩa là có thể tiến lên trong khi chú ý các phương tiện khác.",
  "menkyogentsuki_gentsuki_7_22_2": "Trên đường một chiều, khi đi sát bên trái sẽ cản trở xe ưu tiên thì đi sát bên phải để nhường đường.",
  "menkyogentsuki_gentsuki_7_22_3": "Không có quy tắc cấm vượt xe trên đường một chiều.",
  "menkyogentsuki_gentsuki_7_22_4": "Không phải kiểm tra trong khi để máy chạy.",
  "menkyogentsuki_gentsuki_7_22_5": "Tránh đi qua vũng nước sâu nhất có thể."
};

function updateData(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        if (item.id && translations[item.id] !== undefined) {
          item.explanationVi = translations[item.id];
          console.log(`✓ ${item.id}`);
        }
      }
      updateData(item);
    }
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      updateData(obj[key]);
    }
  }
}

updateData(data);
fs.writeFileSync('app/data/questions.vi.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('\nĐã cập nhật 50 câu!');
