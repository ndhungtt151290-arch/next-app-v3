// Script để cập nhật explanationVi từ file đã dịch
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 1 - 25 câu đầu tiên
const translations = {
  "menkyogentsuki_gentsuki_9_7_1": "Đặt trước bánh dẫn động để thoát khỏi bùn lầy.",
  "menkyogentsuki_gentsuki_9_7_2": "Khu vực trong phạm vi đường bộ nhỏ và 10 mét trước sau là cấm đỗ xe, dừng xe.",
  "menkyogentsuki_gentsuki_9_7_3": "Dù đường có được chiếu sáng bằng đèn đường hay không, vẫn phải bật đèn chiếu sáng phía trước.",
  "menkyogentsuki_gentsuki_9_7_4": "Đúng. Như đề bài đã nêu, nếu không có người đi bộ trên vạch an toàn thì không cần phải chạy chậm. Tuy nhiên, nếu có người đi bộ thì phải chạy chậm.",
  "menkyogentsuki_gentsuki_9_7_5": "Khi không thể giữ khoảng cách an toàn với người đi bộ, phải chạy chậm để di chuyển.",
  "menkyogentsuki_gentsuki_9_8_1": "Biển báo này chỉ đường dành riêng cho ô tô. Xe mô tô phổ thông hai bánh có dung tích xy lanh tổng cộng dưới 125cc và xe gắn máy bị cấm lưu thông.",
  "menkyogentsuki_gentsuki_9_8_2": "Ra tín hiệu rẽ phải/trái trước 30 mét.",
  "menkyogentsuki_gentsuki_9_8_3": "Không được đỗ xe, dừng xe ở vị trí đi vào làn đường bên đường rộng hẹp.",
  "menkyogentsuki_gentsuki_9_8_4": "Hiện tượng aquaplaning là hiện tượng dễ xảy ra khi trời mưa, di chuyển với tốc độ cao.",
  "menkyogentsuki_gentsuki_9_8_5": "Tín hiệu rẽ phải/trái được thực hiện trước 30 mét từ điểm đó. Tín hiệu thay đổi hướng đi được thực hiện trước khoảng 3 giây.",
  "menkyogentsuki_gentsuki_9_9_1": "Xe rẽ phải không được cản trở xe đi thẳng.",
  "menkyogentsuki_gentsuki_9_9_2": "Liên tục phát tín hiệu sẽ gây nhầm lẫn và nguy hiểm.",
  "menkyogentsuki_gentsuki_9_9_3": "Hạ đèn pha xuống để không làm ảnh hưởng đến người lái xe phía trước.",
  "menkyogentsuki_gentsuki_9_9_4": "Vì mép đường có thể bị sụp đổ.",
  "menkyogentsuki_gentsuki_9_9_5": "Vì có thể bị mắc kẹt trong đường bộ nhỏ, không được đi vào.",
  "menkyogentsuki_gentsuki_9_10_1": "Làn đường của xe B là đường ưu tiên.",
  "menkyogentsuki_gentsuki_9_10_2": "Vì vẫn còn cồn trong cơ thể, không được lái xe.",
  "menkyogentsuki_gentsuki_9_10_3": "Trong hầm đường bộ, cấm đỗ xe, dừng xe bất kể có làn đường hay không.",
  "menkyogentsuki_gentsuki_9_10_4": "Vì tốc độ tăng lên và nguy hiểm.",
  "menkyogentsuki_gentsuki_9_10_5": "Xe ô tô thông thường, dù là xe buýt đưa đón trẻ em/học sinh, vẫn phải nhường đường.",
  "menkyogentsuki_gentsuki_9_11_1": "Có nghĩa giống như tín hiệu đèn vàng, nên dừng trước vạch dừng theo nguyên tắc.",
  "menkyogentsuki_gentsuki_9_11_2": "Ngoài ra, xe đạp nhẹ và xe được cấp phép cũng có thể lưu thông.",
  "menkyogentsuki_gentsuki_9_11_3": "Đúng. Đây là biển cấm quay đầu. Ngoài ra, trong kỳ thi lý thuyết có thể có câu hỏi rằng 'ở nơi có biển cấm quay đầu thì lùi xe cũng bị cấm'. Biển cấm quay đầu không bao gồm ý nghĩa cấm lùi, vì vậy nếu có câu hỏi như vậy, hãy chọn đáp án sai.",
  "menkyogentsuki_gentsuki_9_11_4": "Biển báo này chỉ dành riêng cho xe đạp.",
  "menkyogentsuki_gentsuki_9_11_5": "Khi không thể giữ khoảng cách an toàn với xe đối diện, hãy đợi đến khi xe đối diện đi qua."
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
