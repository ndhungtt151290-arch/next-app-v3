// Script để cập nhật explanationVi - Batch 8
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 8
const translations = {
  "menkyogentsuki_gentsuki_10_20_1": "Để giữ thăng bằng, nên siết chặt hai đầu gối vào bình xăng.",
  "menkyogentsuki_gentsuki_10_20_2": "Xe ưu tiên được ưu tiên.",
  "menkyogentsuki_gentsuki_10_20_3": "Phải tiếp tục cho đến khi kết thúc. Sau khi kết thúc, tắt tín hiệu ngay.",
  "menkyogentsuki_gentsuki_10_20_4": "Không được đỗ xe, dừng xe bất hợp pháp.",
  "menkyogentsuki_gentsuki_10_20_5": "Ban đêm phải bật đèn chiếu sáng phía trước.",
  "menkyogentsuki_gentsuki_10_21_1": "Việc sử dụng còi bất đắc dĩ để phòng ngừa nguy hiểm được chấp nhận.",
  "menkyogentsuki_gentsuki_10_21_2": "Ngoài ra, xe đạp nhẹ và xe được cấp phép cũng có thể lưu thông.",
  "menkyogentsuki_gentsuki_10_21_3": "Dù đường sáng, cũng phải bật đèn chiếu sáng phía trước.",
  "menkyogentsuki_gentsuki_10_21_4": "Trong trường hợp này, trước khi vượt lên trước xe tải phải dừng lại một lần và xác nhận an toàn cho người qua đường.",
  "menkyogentsuki_gentsuki_10_21_5": "Không phải giảm tốc mà phải dừng lại.",
  "menkyogentsuki_gentsuki_10_22_1": "Biển báo này cho biết làn đường bên đường dành cho người đi bộ, không thể đỗ xe, dừng xe hay lưu thông xe nhẹ.",
  "menkyogentsuki_gentsuki_10_22_2": "Vì khi trời mưa, bụi đất và cát trên bề mặt đường có mặt đường trở nên như dầu.",
  "menkyogentsuki_gentsuki_10_22_3": "Phải xác nhận an toàn rồi mới phát tín hiệu.",
  "menkyogentsuki_gentsuki_10_22_4": "Nếu không có người đi bộ trên vạch an toàn thì không cần đặc biệt chạy chậm.",
  "menkyogentsuki_gentsuki_10_22_5": "Biển báo này cho biết được rẽ trái. Dù tín hiệu đối diện có màu đỏ hay vàng vẫn có thể rẽ trái.",
  "menkyogentsuki_gentsuki_10_23_1": "Trên đường có lưu lượng giao thông cao, phải luôn đi với đèn chiếu sáng phía trước hướng xuống dưới.",
  "menkyogentsuki_gentsuki_10_23_2": "Biển báo này cho biết đường dành cho người đi bộ. Chỉ những xe được chấp nhận mới có thể đi qua với tốc độ chậm.",
  "menkyogentsuki_gentsuki_10_23_3": "Dù tắt máy và đẩy đi bộ, xe gắn máy kéo xe khác không được coi là người đi bộ.",
  "menkyogentsuki_gentsuki_10_23_4": "Gần đỉnh dốc lên có độ dốc lớn thì cấm vượt xe, nhưng ở giữa dốc thì không bị cấm.",
  "menkyogentsuki_gentsuki_10_23_5": "Biển báo này là biển bấm còi. Bắt buộc phải bấm còi.",
  "menkyogentsuki_gentsuki_10_24_1": "Là từ mặt đất đến độ cao 2 mét, không thể chất hàng ở độ cao 2 mét.",
  "menkyogentsuki_gentsuki_10_24_2": "Nếu xe mình không đi trên đường ưu tiên, thì trong phạm vi ngã tư và 30 mét trước đó cấm vượt xe. Do đó, đề bài sai.",
  "menkyogentsuki_gentsuki_10_24_3": "Vì không cần phát tín hiệu từ trước mà vẫn ít nguy hiểm.",
  "menkyogentsuki_gentsuki_10_24_4": "Vì an toàn, bắt buộc phải đội mũ bảo hiểm.",
  "menkyogentsuki_gentsuki_10_24_5": "Khi cản đường xây dựng hoặc tránh nguy hiểm bất đắc dĩ thì có thể đi trong khu vực đường ray."
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
