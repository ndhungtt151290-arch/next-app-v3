// Script để cập nhật explanationVi - Batch 7
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 7
const translations = {
  "menkyogentsuki_gentsuki_10_13_1": "Trên đường có mặt đường, trời mưa mới bắt đầu dễ trượt hơn.",
  "menkyogentsuki_gentsuki_10_13_2": "Vì để tránh hàng hóa rơi hoặc bay ra.",
  "menkyogentsuki_gentsuki_10_13_3": "Nếu không phải nơi/cases cấm vượt xe thì xe gắn máy cũng có thể vượt xe.",
  "menkyogentsuki_gentsuki_10_13_4": "Có thể dừng ngay được.",
  "menkyogentsuki_gentsuki_10_13_5": "Là hiện tượng xe đang chạy nhanh trượt trên mặt nước.",
  "menkyogentsuki_gentsuki_10_14_1": "Sau khi phát tín hiệu, một lần nữa xác nhận an toàn rồi mới thay đổi hướng đi.",
  "menkyogentsuki_gentsuki_10_14_2": "Được gọi là phương pháp lái xe 'vào chậm - ra nhanh'.",
  "menkyogentsuki_gentsuki_10_14_3": "Biển báo này cho biết có nguy hiểm khác.",
  "menkyogentsuki_gentsuki_10_14_4": "Biển báo này cho biết đường dành riêng cho ô tô, xe gắn máy không thể lưu thông.",
  "menkyogentsuki_gentsuki_10_14_5": "Biển báo này cho biết tốc độ tối đa 50 km/h, nhưng tốc độ tối đa của xe gắn máy là 30 km/h.",
  "menkyogentsuki_gentsuki_10_15_1": "Nghiêng người khi lái xe là nguy hiểm.",
  "menkyogentsuki_gentsuki_10_15_2": "Có nghĩa giống như đèn tín hiệu màu đỏ. Ngoài ra, 'giao thông theo hướng giao cắt vuông góc với hướng song song với mặt đối diện của cơ thể cảnh sát' trong đề bài, nói đơn giản là 'xe đi từ phía trước hoặc phía sau khi nhìn thẳng cảnh sát'. Đây là cách nói thường xuyên xuất hiện trong bài thi cấp GPL.",
  "menkyogentsuki_gentsuki_10_15_3": "Đề bài đúng. Ngoài ra, trong trường hợp không phải dốc xuống có độ dốc lớn mà là dốc lên có độ dốc lớn thì không cần chạy chậm.",
  "menkyogentsuki_gentsuki_10_15_4": "Sau khi hoàn thành hành động, nên tắt tín hiệu ngay.",
  "menkyogentsuki_gentsuki_10_15_5": "Khi tắt máy xe gắn máy và đẩy đi bộ, được coi là người đi bộ.",
  "menkyogentsuki_gentsuki_10_16_1": "Làn đường bên đường này là làn đường bên đường cấm đỗ/dừng xe, người đi bộ và xe nhẹ có thể lưu thông nhưng xe gắn máy không thể lưu thông.",
  "menkyogentsuki_gentsuki_10_16_2": "Tại ngã tư có trạng thái gọi là 'toàn đỏ', tất cả tín hiệu đều màu đỏ. Do đó, dù tín hiệu trái phải có màu đỏ hoặc vàng, nhưng tín hiệu đối diện không nhất thiết là màu xanh.",
  "menkyogentsuki_gentsuki_10_16_3": "Xe đi thẳng và xe rẽ trái có quyền ưu tiên.",
  "menkyogentsuki_gentsuki_10_16_4": "Dốc có độ dốc lớn là cấm đỗ xe, dừng xe.",
  "menkyogentsuki_gentsuki_10_16_5": "Nếu vì phòng ngừa nguy hiểm thì có thể đi vào làn đường dành riêng cho xe buýt.",
  "menkyogentsuki_gentsuki_10_17_1": "Nếu có đèn tín hiệu màu đỏ thì phải dừng ở vị trí dừng.",
  "menkyogentsuki_gentsuki_10_17_2": "Không chỉ 'nên' hiển thị mà có 'nghĩa vụ' phải hiển thị.",
  "menkyogentsuki_gentsuki_10_17_3": "Khởi hành đột ngột là nguy hiểm.",
  "menkyogentsuki_gentsuki_10_17_4": "Xe hai bánh cũng có bán kính quay vòng trong khác nhau, nên đặc biệt khi rẽ trái cần chú ý không cuốn người đi bộ và xe đạp.",
  "menkyogentsuki_gentsuki_10_17_5": "Biển báo này cho biết có vạch qua đường cho người đi bộ.",
  "menkyogentsuki_gentsuki_10_18_1": "Vì có thể cổ đã gãy.",
  "menkyogentsuki_gentsuki_10_18_2": "Đúng. Nếu gây tai nạn giao thông thì nên gọi cảnh sát.",
  "menkyogentsuki_gentsuki_10_18_3": "Không được cản trở xe phía trước thay đổi hướng đi. Tuy nhiên, có ngoại lệ trong trường hợp tránh bằng phanh gấp hoặc cua gấp.",
  "menkyogentsuki_gentsuki_10_18_4": "Không nhất thiết phải làm mỗi ngày, mà tùy theo tình trạng sử dụng như trước khi lên xe.",
  "menkyogentsuki_gentsuki_10_18_5": "Chỉ một chiếc, xe gắn máy có thể kéo rơ moóc.",
  "menkyogentsuki_gentsuki_10_19_1": "Điều quan trọng là cố gắng tránh va chạm đến giới hạn cuối cùng.",
  "menkyogentsuki_gentsuki_10_19_2": "Vì có thể xe phía trước đột ngột phanh.",
  "menkyogentsuki_gentsuki_10_19_3": "Người đi xe đạp có thể lưu thông trên vỉa hè.",
  "menkyogentsuki_gentsuki_10_19_4": "Có thể lưu thông trên làn đường bên phải.",
  "menkyogentsuki_gentsuki_10_19_5": "Khi rẽ phải vào đường nhỏ, phải nhường đường cho xe đi thẳng và xe rẽ trái."
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
