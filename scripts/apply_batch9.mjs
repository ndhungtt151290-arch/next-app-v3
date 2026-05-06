// Script để cập nhật explanationVi - Batch 9
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 9
const translations = {
  "menkyogentsuki_gentsuki_10_25_1": "Dù có sử dụng chock bánh xe, đỉnh dốc vẫn cấm đỗ xe, dừng xe.",
  "menkyogentsuki_gentsuki_10_25_2": "Không cần dừng lại, chú ý các phương tiện khác để tiến vào.",
  "menkyogentsuki_gentsuki_10_25_3": "Ở khúc cua của đường, bất kể tầm nhìn, phải luôn chạy chậm.",
  "menkyogentsuki_gentsuki_10_25_4": "Vì cản trở giao thông, nên phải di chuyển xe.",
  "menkyogentsuki_gentsuki_10_25_5": "Biển báo này cho biết làn đường bên đường dành cho người đi bộ, không thể đỗ xe, dừng xe trong làn đường bên đường.",
  "menkyogentsuki_gentsuki_10_26_1": "Ở đường có vỉa hè, đỗ xe dọc theo mép đường.",
  "menkyogentsuki_gentsuki_10_26_2": "Xe gắn máy không có giấy chứng nhận车库. Tuy nhiên, để xe gắn máy ở đường công cộng là đương nhiên bất hợp pháp.",
  "menkyogentsuki_gentsuki_10_26_3": "Có thể đi qua khi qua đường, quay đầu, rẽ phải/trái.",
  "menkyogentsuki_gentsuki_10_26_4": "Đối với xe gắn máy ba bánh, có các loại như xe tay ga ba bánh (three-wheeler).",
  "menkyogentsuki_gentsuki_10_26_5": "Còi không nên được sử dụng để chào hỏi.",
  "menkyogentsuki_gentsuki_10_27_1": "Tín hiệu mũi tên màu vàng là tín hiệu dành cho xe điện đường phố.",
  "menkyogentsuki_gentsuki_10_27_2": "Khi tín hiệu của đèn tín hiệu giao thông và tín hiệu tay của cảnh sát khác nhau, phải tuân theo tín hiệu tay của cảnh sát.",
  "menkyogentsuki_gentsuki_10_27_3": "Khi xe phía trước rẽ phải và đi gần giữa đường, thì đi qua bên trái của xe đó.",
  "menkyogentsuki_gentsuki_10_27_4": "Quán tính là lực mà khi cố dừng xe, xe cố gắng tiếp tục chạy.",
  "menkyogentsuki_gentsuki_10_27_5": "Khi xe buýt phát tín hiệu khởi hành thì nhường đường.",
  "menkyogentsuki_gentsuki_10_28_1": "Biển báo này cho biết cấm quay đầu. Dù là xe gắn máy cũng bị cấm quay đầu.",
  "menkyogentsuki_gentsuki_10_28_2": "Dù chỉ đỗ xe trong thời gian ngắn, cũng phải khóa xe và mang theo chìa khóa.",
  "menkyogentsuki_gentsuki_10_28_3": "Đường tuyết mặt đường dễ trơn trượt.",
  "menkyogentsuki_gentsuki_10_28_4": "Đối với xe chạy theo hướng đông-tây, giống như đèn đỏ.",
  "menkyogentsuki_gentsuki_10_28_5": "Sai. Khi đang đi trong ngã tư mà đèn phía trước chuyển sang vàng, thì không được dừng trong ngã tư mà phải ra khỏi ngã tư.",
  "menkyogentsuki_gentsuki_10_29_1": "Đúng. Để tránh bị cuốn vào, cần phải xác nhận bằng mắt thật kỹ.",
  "menkyogentsuki_gentsuki_10_29_2": "Xe ở phía có vật cản phải giảm tốc hoặc dừng lại để nhường đường.",
  "menkyogentsuki_gentsuki_10_29_3": "Báo cho lái tàu đồng thời di chuyển xe ra khỏi đường bộ nhỏ.",
  "menkyogentsuki_gentsuki_10_29_4": "Khi chạy với tốc độ cao, nếu trọng tâm hàng hóa cao thì có nguy cơ bị lật ngang.",
  "menkyogentsuki_gentsuki_10_29_5": "Xe hai bánh và xe gắn máy có thể chất hàng nhô ra hai bên tới 0,15 mét từ thùng xe.",
  "menkyogentsuki_gentsuki_10_30_1": "Xe hai bánh dễ bị người lái xe bốn bánh bỏ sót, nên hãy mặc quần áo sáng màu khi lái xe.",
  "menkyogentsuki_gentsuki_10_30_2": "Đúng. Tại ngã tư có độ rộng tương tự mà không có đèn tín hiệu, phải ưu tiên xe đi vào ngã tư từ bên trái so với mình.",
  "menkyogentsuki_gentsuki_10_30_3": "Đúng. Khoảng cách từ khi phanh đến khi bánh xe bắt đầu quay là khoảng cách không tải, khoảng cách từ khi phanh đến khi xe dừng là khoảng cách phanh. Tổng khoảng cách không tải và khoảng cách phanh là khoảng cách dừng.",
  "menkyogentsuki_gentsuki_10_30_4": "Vì tầm nhìn kém, hãy giữ khoảng cách an toàn lớn hơn so với trời nắng.",
  "menkyogentsuki_gentsuki_10_30_5": "Dưới 10 km/h là một tiêu chuẩn."
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
