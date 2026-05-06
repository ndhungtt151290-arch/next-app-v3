// Script để cập nhật explanationVi - Batch 11
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 11 - các câu illust
const translations = {
  "menkyogentsuki_gentsuki_7_23_1": "Biển báo giới hạn chiều rộng tối đa. Cũng có biển báo giới hạn chiều cao.",
  "menkyogentsuki_gentsuki_7_23_2": "Biển báo này cho biết chú ý gió ngang.",
  "menkyogentsuki_gentsuki_7_23_3": "Khi rẽ phải/trái tại ngã tư, bắt buộc phải chạy chậm.",
  "menkyogentsuki_gentsuki_7_23_4": "Việc cố định hàng hóa bằng dây thừng cũng rất quan trọng.",
  "menkyogentsuki_gentsuki_7_23_5": "Dừng xe trong thời gian ngắn mà người lái có thể lái xe ngay là 'dừng xe'."
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
