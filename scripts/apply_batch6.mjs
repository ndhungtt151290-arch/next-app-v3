// Script để cập nhật explanationVi - Batch 6
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// Dịch batch 6
const translations = {
  "menkyogentsuki_gentsuki_10_7_1": "Dừng xe dưới 5 phút để xếp/dỡ hàng là dừng xe. Do đó, dừng xe 3 phút để xếp/dỡ hàng như trong đề bài là dừng xe. Ngoài ra, dừng xe trên 5 phút để xếp/dỡ hàng là đỗ xe.",
  "menkyogentsuki_gentsuki_10_7_2": "Như đề bài đã nêu, khi đâm vào tường bê tông với tốc độ 60 km/h, sẽ chịu lực tương đương khi rơi từ độ cao khoảng 14 mét. Tất nhiên, tốc độ càng nhanh thì lực tác động càng lớn, nên chạy quá tốc độ rất nguy hiểm.",
  "menkyogentsuki_gentsuki_10_7_3": "Trong trường hợp này, xe gắn máy phải rẽ phải hai giai đoạn.",
  "menkyogentsuki_gentsuki_10_7_4": "Gần khúc cua của đường, bất kể tầm nhìn tốt hay xấu, phải chạy chậm.",
  "menkyogentsuki_gentsuki_10_7_5": "Xe không phải xe ưu tiên không cần nhường đường.",
  "menkyogentsuki_gentsuki_10_8_1": "Chạy chậm là tốc độ có thể dừng ngay lập tức, khoảng dưới 10 km/h. Chỉ giảm tốc độ thôi là không đủ.",
  "menkyogentsuki_gentsuki_10_8_2": "Lực va chạm tỷ lệ với bình phương tốc độ, nên khi tốc độ giảm một nửa thì lực va chạm giảm khoảng 1/4.",
  "menkyogentsuki_gentsuki_10_8_3": "Khi đi trên đường ưu tiên hoặc khi có tín hiệu giao thông v.v. thì không cần chạy chậm.",
  "menkyogentsuki_gentsuki_10_8_4": "Không chỉ thiệt hại lớn hơn khi lộ ra ngoài mà còn dễ bị mệt.",
  "menkyogentsuki_gentsuki_10_8_5": "Đối với giao thông hướng về phía có người cảnh sát đối diện, luôn là tín hiệu đèn màu đỏ.",
  "menkyogentsuki_gentsuki_10_9_1": "Không phải chạy chậm mà phải dừng lại.",
  "menkyogentsuki_gentsuki_10_9_2": "Khi tránh vật cản hoặc để tránh nguy hiểm, có thể đi trên hai làn đường.",
  "menkyogentsuki_gentsuki_10_9_3": "Khi đâm vào tường bê tông với tốc độ 60 km/h, sẽ chịu lực tương đương khi rơi từ độ cao khoảng 14 mét.",
  "menkyogentsuki_gentsuki_10_9_4": "Đúng. Gần đỉnh dốc, đặc biệt là khi xuống dốc, việc vượt xe không bị cấm. Tuy nhiên, theo như đề bài, khi lên dốc gần đỉnh thì vượt xe bị cấm. Ngoài ra, dốc xuống có độ dốc lớn cũng bị cấm vượt xe.",
  "menkyogentsuki_gentsuki_10_9_5": "Sai. Người lái xe không được phép làm bắn bùn hoặc nước lên người đi bộ. Dù có chạy chậm thì cũng không có nghĩa là người lái xe không có trách nhiệm.",
  "menkyogentsuki_gentsuki_10_10_1": "Không có quy tắc cấm vượt xe trên đường một chiều.",
  "menkyogentsuki_gentsuki_10_10_2": "Khi có người trên vạch an toàn thì phải chạy chậm để đi qua.",
  "menkyogentsuki_gentsuki_10_10_3": "Vì có thể bật đèn khi trong hầm đường bộ hoặc khi trời tối.",
  "menkyogentsuki_gentsuki_10_10_4": "Trước hết, khi có xe đối diện thì không được vượt xe.",
  "menkyogentsuki_gentsuki_10_10_5": "Trong hầm đường bộ có làn đường thì có thể vượt xe.",
  "menkyogentsuki_gentsuki_10_11_1": "Biển báo này cho biết có đường bộ nhỏ.",
  "menkyogentsuki_gentsuki_10_11_2": "Sai. Tại ngã tư có độ rộng tương tự mà không có đèn tín hiệu, giao thông từ 'bên trái' có quyền ưu tiên.",
  "menkyogentsuki_gentsuki_10_11_3": "Không được chở 2 người.",
  "menkyogentsuki_gentsuki_10_11_4": "Sai. Biển báo này cho biết vạch an toàn, là nơi như bến xe, xe lưu thông, dừng xe không và người đi bộ tự do lưu thông. Ngoài ra, biển báo khu vực cấm đi vào là vạch chéo màu trắng trong khung màu vàng.",
  "menkyogentsuki_gentsuki_10_11_5": "Để tránh trượt, khi phanh thì phanh nhiều lần.",
  "menkyogentsuki_gentsuki_10_12_1": "Khi lái xe đường dài, cần lập kế hoạch lái xe từ trước.",
  "menkyogentsuki_gentsuki_10_12_2": "Giấy chứng nhận đăng ký xe và giấy chứng nhận bảo hiểm bắt buộc phải được trang bị trên xe gắn máy.",
  "menkyogentsuki_gentsuki_10_12_3": "Cấm đỗ xe trong phạm vi 1 mét từ báo cháy. Ngoài ra, không cấm dừng xe.",
  "menkyogentsuki_gentsuki_10_12_4": "Đây là biển dành cho người khuyết tật. Cho biết người có khuyết tật thể chất đang lái xe.",
  "menkyogentsuki_gentsuki_10_12_5": "Đúng. Biển báo này cho biết ưu tiên xe buýt. Làn đường được chỉ định bởi biển ưu tiên xe buýt có thể đi nếu không có xe buýt. Khi xe buýt đến gần thì cần ra khỏi làn đường. Ngoài ra, nếu có biển 'dành riêng' cho xe buýt chứ không phải 'ưu tiên' thì không thể đi."
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
