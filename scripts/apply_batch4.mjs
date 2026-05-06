// Script để cập nhật explanationVi - Batch 4
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 4
const translations = {
  "menkyogentsuki_gentsuki_9_21_1": "Vì gây ra tiếng ồn.",
  "menkyogentsuki_gentsuki_9_21_2": "Đây là biển dành cho người lái xe cao tuổi. Cho biết người từ 70 tuổi trở lên đang lái xe.",
  "menkyogentsuki_gentsuki_9_21_3": "Biển báo này là biển cảnh báo có trường học, v.v.",
  "menkyogentsuki_gentsuki_9_21_4": "Khi phát hiện giấy phép, hãy nộp lại ngay.",
  "menkyogentsuki_gentsuki_9_21_5": "Biển báo này cho biết cấm vượt xe bằng cách lấn phải để vượt. Do đó, có thể vượt xe miễn là không vượt qua vạch kẻ vàng.",
  "menkyogentsuki_gentsuki_9_22_1": "Đúng. Theo Điều 34 Khoản 1 Luật Giao thông đường bộ. Lý do được quy định như vậy là để tránh cuốn xe hai bánh vào khi rẽ trái.",
  "menkyogentsuki_gentsuki_9_22_2": "Sai. Biển báo này là biển giới hạn chiều rộng tối đa.",
  "menkyogentsuki_gentsuki_9_22_3": "Được gọi là hiện tượng bay hơi.",
  "menkyogentsuki_gentsuki_9_22_4": "Chỉ có thể lái xe gắn máy có dung tích xy lanh tổng cộng dưới 50cc (hoặc dưới 125cc nếu công suất tối đa bị giới hạn dưới 4.0kW).",
  "menkyogentsuki_gentsuki_9_22_5": "Biển báo này cho biết làn đường bên đường cấm đỗ xe, dừng xe.",
  "menkyogentsuki_gentsuki_9_23_1": "Bất kể thời gian hoạt động, cấm đỗ xe, dừng xe trong khu vực đường ray xe điện đường phố.",
  "menkyogentsuki_gentsuki_9_23_2": "Biển báo này cho biết có giao thông hợp nhất. Đi qua cẩn thận.",
  "menkyogentsuki_gentsuki_9_23_3": "Cần đặc biệt thận trọng khi xe phía trước là xe lớn.",
  "menkyogentsuki_gentsuki_9_23_4": "Vì xe gắn máy là phương tiện giữ thăng bằng bằng cơ thể, nên đòi hỏi kỹ thuật khác với xe bốn bánh.",
  "menkyogentsuki_gentsuki_9_23_5": "Việc vượt xe cần khoảng cách đủ. Khi có thể nhìn thấy toàn bộ trong gương, có thể nói rằng xe vượt đã ở đủ xa phía sau.",
  "menkyogentsuki_gentsuki_9_24_1": "Khi xe ưu tiên đang cố gắng nhập hoặc thoát khỏi làn đường chính, không được cản trở việc đi lại của chúng.",
  "menkyogentsuki_gentsuki_9_24_2": "Sai. Khi luyện tập trên đường bằng bằng tạm thời, cần phải có người hướng dẫn đủ điều kiện (người có bằng hạng nhất với tổng thời gian sở hữu trên 3 năm không tính thời gian bị đình chỉ, hoặc người có bằng hạng hai) ngồi cùng.",
  "menkyogentsuki_gentsuki_9_24_3": "Khoảng cách phanh tỷ lệ với bình phương tốc độ. Khi tốc độ tăng gấp đôi, khoảng cách phanh tăng gấp bốn.",
  "menkyogentsuki_gentsuki_9_24_4": "Ngay cả khi đèn tín hiệu màu xanh, vẫn phải xác nhận an toàn rồi mới khởi hành.",
  "menkyogentsuki_gentsuki_9_24_5": "Không nhất thiết phải luôn dừng lại, có thể chạy chậm để tiến vào.",
  "menkyogentsuki_gentsuki_9_25_1": "Ở đường có vỉa hè, đỗ xe dọc theo mép đường.",
  "menkyogentsuki_gentsuki_9_25_2": "Không nên thay đổi làn đường không cần thiết. Không chỉ gây ra tai nạn mà còn là nguyên nhân gây tắc đường.",
  "menkyogentsuki_gentsuki_9_25_3": "Vì khó phát hiện xe đối diện.",
  "menkyogentsuki_gentsuki_9_25_4": "Biển báo này cho biết có vạch qua đường cho người đi bộ.",
  "menkyogentsuki_gentsuki_9_25_5": "Bất kể có người đi bộ hay không, làn đường bên đường bị cấm lưu thông.",
  "menkyogentsuki_gentsuki_9_26_1": "Đúng. Gần đỉnh dốc, đặc biệt là khi xuống dốc, việc vượt xe không bị cấm. Tuy nhiên, theo như đề bài, khi lên dốc gần đỉnh thì vượt xe bị cấm. Ngoài ra, dốc xuống có độ dốc lớn cũng bị cấm vượt xe.",
  "menkyogentsuki_gentsuki_9_26_2": "Biển báo này cho biết phương pháp rẽ phải cho xe gắn máy (rẽ phải hai giai đoạn).",
  "menkyogentsuki_gentsuki_9_26_3": "Biển báo này là biển cấm đi theo hướng khác ngoài hướng chỉ định, rẽ phải bị cấm.",
  "menkyogentsuki_gentsuki_9_26_4": "Mô tả trong đề bài là đúng. Ngoài ra, vượt xe trong phạm vi 30 mét từ đường bộ nhỏ, vạch qua đường cho người đi bộ, làn đường dành cho xe đạp cũng bị cấm.",
  "menkyogentsuki_gentsuki_9_26_5": "Biểu thị cấm xe ô tô ngoài xe hai bánh."
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
