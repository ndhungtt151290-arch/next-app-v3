// Script để cập nhật explanationVi - batch cuối cùng
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('app/data/questions.vi.json', 'utf-8'));

// All remaining translations
const translations = {
  "トラックは歩行者に気づいて停止したかもしれない。たとえトラックが停止し、進路が確保されたとしても、ちゃんと安全を確認して左折する。": "Xe tải có thể đã dừng vì nhận ra người đi bộ. Dù xe tải đã dừng và đường đã thông, vẫn phải xác nhận an toàn rồi mới rẽ trái.",
  "トラックは歩行者に気づいて停止したかもしれない。たとえトラックが停止し、進路が確保されたとしても、ちゃんと安全を確認し": "Xe tải có thể đã dừng vì nhận ra người đi bộ. Dù xe tải đã dừng và đường đã thông, vẫn phải xác nhận an toàn rồi mới rẽ trái.",
  "交差点では、横断歩行者が優先である。歩行者が止まるだろうと考えておりますならない。": "Tại ngã tư, người đi bộ qua đường có quyền ưu tiên. Không được nghĩ rằng người đi bộ sẽ dừng lại.",
  "子どもは予測できない動きをするため，注意が必要である。": "Trẻ em có thể hành động không thể đoán trước, cần chú ý.",
  "子どもは予測できない動きをするため，注意が必要です。": "Trẻ em có thể hành động không thể đoán trước, cần chú ý.",
  "後続車がいるからスタート，急いで右折する必要はない。": "Dù có xe phía sau cũng không cần vội vàng rẽ phải.",
  "駐車の陰から人が飛び出すことは多い。": "Người thường chạy ra từ bóng xe đỗ.",
  "駐車の陰から人が飛び出すことは多い。": "Người thường chạy ra từ bóng xe đỗ.",
  "駐車の陰から人が飛び出すことは多い。": "Người thường chạy ra từ bóng xe đỗ.",
  "バイクは実際よりも遠くにあるように見えるため，注意が必要である。": "Xe máy có vẻ ở xa hơn thực tế, cần chú ý.",
  "バイクは実際よりも遠くにあるように見えるため，注意が必要です。": "Xe máy có vẻ ở xa hơn thực tế, cần chú ý.",
  "後続車が直進や左折する場合，それ，待ってから右折する。": "Khi xe phía sau đi thẳng hoặc rẽ trái, đợi rồi mới rẽ phải.",
  "後続車が直進や左折する場合，それ，待ってから右折します。": "Khi xe phía sau đi thẳng hoặc rẽ trái, đợi rồi mới rẽ phải.",
  "本来は自車が優先だが、対向車が右折を始めているときは，先に右折させる。": "Vốn dĩ xe mình có quyền ưu tiên, nhưng khi xe đối diện bắt đầu rẽ phải thì nhường rẽ trước.",
  "交差点を進行するときは，安全確認を怠ってはならない。": "Khi đi qua ngã tư, không được bỏ qua việc xác nhận an toàn.",
  "交差点を進行するとき，安全確認を怠ってはなりません。": "Khi đi qua ngã tư, không được bỏ qua việc xác nhận an toàn.",
  "交差点は小回りを心がける。": "Tại ngã tư nên quay vòng nhỏ.",
  "タクシーが停車することを予測する必要がある。": "Cần dự đoán taxi sẽ dừng.",
  "急ハンドルは危険である。": "Đánh lái gấp là nguy hiểm.",
  "急ハンドルは危険です。": "Đánh lái gấp là nguy hiểm.",
  "後続車が方向指示器を点滅させているため，追い越しさせる。": "Vì xe phía sau đang nhấp nháy đèn báo rẽ nên nhường vượt.",
  "後続車が方向指示器を点滅させているため，追い越しさせます。": "Vì xe phía sau đang nhấp nháy đèn báo rẽ nên nhường vượt.",
  "眩惑現象とは，眩しさにより視界が奪われることである。": "Hiện tượng chói là mất tầm nhìn vì ánh sáng chói.",
  "夜間は，視界が悪くなるため，速度を昼間より落とすことが求められる。": "Ban đêm tầm nhìn kém hơn nên cần giảm tốc độ so với ban ngày.",
  "いわゆるキープレフトである。": "Còn gọi là giữ trái.",
  "カーブでは，曲がり切れずに膨らむ車もいる。": "Ở đường cong, có xe không thể cua hết và bị lệch ra ngoài.",
  "カーブの先が見えないが，对向車がいることも想定して運転する。": "Không nhìn thấy phía trước đường cong nhưng vẫn lái xe dự kiến có xe đối diện.",
  "速度を上げると，曲がりきれなくなるおそれがある。": "Tăng tốc có thể không cua hết.",
  "横断歩行者が優先である。前車が左折したとしても，歩行者が止まるだろうと考えておりますならない。": "Người đi bộ qua đường có quyền ưu tiên. Dù xe phía trước rẽ trái, cũng không được nghĩ rằng người đi bộ sẽ dừng.",
  "たとえ前車が安全に左折したとしても，必ず安全を確認し，徐行して左折する。": "Dù xe phía trước đã rẽ trái an toàn, cũng phải xác nhận an toàn và chạy chậm để rẽ trái.",
  "道路の先で，歩行者が横断してきているかもしれない。": "Phía trước có thể có người đi bộ đang qua đường.",
  "カーブでは，速度を上げると，遠心力が働き曲がりきれないおそれがあるため，速度を落とす必要がある。": "Ở đường cong, tăng tốc sẽ có lực ly tâm nên có thể không cua hết, cần giảm tốc.",
  "上り坂の頂上付近は徐行せねばならない。徐行とは，すぐに止まれる速度のことを言う。単に速度を落とすだけでは不適当である。": "Gần đỉnh dốc lên phải chạy chậm. Chạy chậm là tốc độ có thể dừng ngay. Chỉ giảm tốc độ thôi là không đủ.",
  "上り坂の頂上付近は徐行せねばなりません。徐行とは，すぐに止まれる速度のことを言います。単に速度を落とすだけでは不适当です。": "Gần đỉnh dốc lên phải chạy chậm. Chạy chậm là tốc độ có thể dừng ngay. Chỉ giảm tốc độ thôi là không đủ.",
  "信号が黄色で，対向車も来ているため，前車を追い越して直進するのは危険である。": "Đèn vàng và có xe đối diện nên vượt xe phía trước để đi thẳng là nguy hiểm.",
  "急ブレーキは避け，数回に分けてブレーキをかける。": "Tránh phanh gấp, phanh nhiều lần.",
  "急ブレーキは避け，数回に分けてブレーキをかけます。": "Tránh phanh gấp, phanh nhiều lần.",
  "対向車が自차를優先するに違いないという思い込みをしない。": "Không nghĩ rằng xe đối diện chắc chắn sẽ nhường mình.",
  "停止するだろうと考えております運転するのは危険である。": "Lái xe khi nghĩ rằng đối phương sẽ dừng là nguy hiểm.",
  "停止するだろうと考えております運転するのは危険です。": "Lái xe khi nghĩ rằng đối phương sẽ dừng là nguy hiểm.",
  "対向車の陰にいて，見えない可能性もある。": "Có thể có người đứng trong bóng xe đối diện mà không nhìn thấy.",
  "濯滞のため，自車が見えていない可能性がある。": "Vì kẹt xe nên có thể không nhìn thấy xe mình.",
  "濯滞のため，自車が見えていない可能性があります。": "Vì kẹt xe nên có thể không nhìn thấy xe mình.",
  "踏切の安全確認は，必ず一時停止して，自分の目と耳で必ず行う。": "Xác nhận an toàn đường bộ nhỏ phải dừng lại một lần, bằng mắt và tai mình.",
  "踏切の安全確認は，必ず一時停止して，自分の目と耳で必ず“行います。": "Xác nhận an toàn đường bộ nhỏ phải dừng lại một lần, bằng mắt và tai mình.",
  "対向車がいたとしても，できるだけ線路の中心部分を走行する。": "Dù có xe đối diện, vẫn đi gần giữa đường ray nhất có thể.",
  "踏切の中に取り残されそうなときは踏切内に進入しない。": "Khi có vẻ như sẽ bị mắc kẹt trong đường bộ nhỏ, không đi vào trong đường bộ nhỏ.",
  "大型車のかげに入ると，他の交通や歩行者の姿が目に入りにくくなるばかりか，自車が見落とされやすくなり，危険である。": "Khi đi vào bóng xe lớn, không chỉ khó nhìn thấy các phương tiện và người đi bộ khác mà xe mình còn dễ bị bỏ sót, nguy hiểm.",
  "トラックに続いて右折すると，対向車が自直に気づかない可能性がある。": "Khi rẽ phải theo sau xe tải, xe đối diện có thể không nhận ra xe mình.",
  "大型物に続いて右折する場合は，すぐに後に続かず，一度止まって安全を確認してから右折する。": "Khi rẽ phải theo sau xe lớn, không đi ngay mà dừng một lần, xác nhận an toàn rồi mới rẽ phải.",
  "前方右折したトラックが左折準備のために減速しているおそれがあり，自車が追上す可能性がある。": "Xe tải phía trước có thể đang giảm tốc để chuẩn bị rẽ trái, xe mình có thể đuổi kịp.",
  "前方右折したトラックが左折準備のために減速しているおそれがあり，自車が追上す很有可能性です。": "Xe tải phía trước có thể đang giảm tốc để chuẩn bị rẽ trái, xe mình có thể đuổi kịp.",
  "前方右折したトラックが左折準備のために減速しているおそれがあり，自車が追上す可能性がある。": "Xe tải phía trước có thể đang giảm tốc để chuẩn bị rẽ trái, xe mình có thể đuổi kịp.",
  "濡れた鉄板の上は，滑りやすいため速度を落とす。": "Trên tấm sắt ướt dễ trượt nên giảm tốc.",
  "前車との間に十分な車間距離をとる。": "Giữ khoảng cách an toàn đủ với xe phía trước.",
  "車間距離をつめすぎることは危険である。": "Đi quá sát khoảng cách nguy hiểm.",
  "たとえ信号が青でも，安全を確認し，進行する。急いで直進してはならない。": "Dù đèn xanh, vẫn xác nhận an toàn rồi mới tiến lên. Không được vội vàng đi thẳng."
};

function updateSubs(subs) {
  if (Array.isArray(subs)) {
    for (const sub of subs) {
      if (sub && typeof sub === 'object' && sub.explanation && sub.explanationVi === null) {
        const key = sub.explanation.trim();
        if (translations[key]) {
          sub.explanationVi = translations[key];
          console.log(`✓ ${key.slice(0, 40)}...`);
        }
      }
    }
  }
}

if (data.scenarioGroups) {
  for (const group of data.scenarioGroups) {
    if (group.subs) updateSubs(group.subs);
  }
}

if (data.dangerScenarioGroups) {
  for (const group of data.dangerScenarioGroups) {
    if (group.subs) updateSubs(group.subs);
  }
}

fs.writeFileSync('app/data/questions.vi.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('\nHoàn thành!');
