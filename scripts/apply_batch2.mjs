// Script để cập nhật explanationVi từ file đã dịch
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 2 - 50 câu tiếp theo
const translations = {
  "menkyogentsuki_gentsuki_9_12_1": "Cấm dừng xe, đỗ xe ở điểm dừng xe buýt.",
  "menkyogentsuki_gentsuki_9_12_2": "Vì có thể gây tai nạn cho người đi xe đạp.",
  "menkyogentsuki_gentsuki_9_12_3": "Vì có thể làm hỏng dây cáp.",
  "menkyogentsuki_gentsuki_9_12_4": "Không. Đèn tín hiệu cho người đi bộ chỉ có màu đỏ và xanh.",
  "menkyogentsuki_gentsuki_9_12_5": "Đúng. Đây là biển cấm dừng xe và đỗ xe.",
  "menkyogentsuki_gentsuki_9_13_1": "Xe buýt đưa đón trẻ em có quyền ưu tiên tuyệt đối. Phải dừng xe nhường đường.",
  "menkyogentsuki_gentsuki_9_13_2": "Vì cần giữ khoảng cách an toàn.",
  "menkyogentsuki_gentsuki_9_13_3": "Không. Xe mô tô phổ thông có thể chạy trên làn đường bên phải.",
  "menkyogentsuki_gentsuki_9_13_4": "Vì có thể gây nguy hiểm cho người đi bộ.",
  "menkyogentsuki_gentsuki_9_13_5": "Biển báo này cho biết có người đi xe đạp thường xuyên qua lại.",
  "menkyogentsuki_gentsuki_9_14_1": "Trong khu vực cấm dừng xe, cấm cả việc đỗ xe.",
  "menkyogentsuki_gentsuki_9_14_2": "Vì có thể gây tắc nghẽn giao thông.",
  "menkyogentsuki_gentsuki_9_14_3": "Khi rẽ phải vào đường nhỏ, phải nhường đường cho xe đi thẳng và xe rẽ trái.",
  "menkyogentsuki_gentsuki_9_14_4": "Đúng. Đây là biển báo cho biết có đường dành cho xe mô tô phổ thông.",
  "menkyogentsuki_gentsuki_9_14_5": "Vì có thể gây tai nạn cho xe đi phía sau.",
  "menkyogentsuki_gentsuki_10_1_1": "Đúng. Đây là biển cấm vượt xe.",
  "menkyogentsuki_gentsuki_10_1_2": "Vì khi vượt xe, tầm nhìn phía trước bị hạn chế.",
  "menkyogentsuki_gentsuki_10_1_3": "Vì có thể xảy ra tai nạn đối đầu.",
  "menkyogentsuki_gentsuki_10_1_4": "Vì có thể gây nguy hiểm cho người đi xe đạp.",
  "menkyogentsuki_gentsuki_10_1_5": "Không được vượt xe khi đang ở trong đường hầm.",
  "menkyogentsuki_gentsuki_10_2_1": "Khi có người đi bộ băng qua phía trước, phải giảm tốc độ và dừng xe nếu cần thiết.",
  "menkyogentsuki_gentsuki_10_2_2": "Vì có thể gây nguy hiểm cho người đi xe đạp.",
  "menkyogentsuki_gentsuki_10_2_3": "Đúng. Đây là biển cấm vượt xe.",
  "menkyogentsuki_gentsuki_10_2_4": "Không. Đèn tín hiệu giao thông cho xe cơ giới có màu vàng nhấp nháy nghĩa là chú ý.",
  "menkyogentsuki_gentsuki_10_2_5": "Vì có thể gây tai nạn cho người đi xe đạp."
};

// Hàm cập nhật
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
console.log('\nĐã cập nhật 25 câu!');
