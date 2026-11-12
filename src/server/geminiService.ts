import { GoogleGenAI } from '@google/genai';

export interface GroundingPlaceInfo {
  title?: string;
  uri?: string;
  address?: string;
  reviewSnippets?: Array<{ reviewText?: string; authorAttribution?: { displayName?: string } }>;
}

export interface GroundingResponse {
  text: string;
  places: GroundingPlaceInfo[];
  groundingChunks: any[];
}

export async function querySchoolMapsGrounding(queryText: string): Promise<GroundingResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      text: `Trường THPT Hàn Thuyên là một trong những ngôi trường trung học phổ thông giàu truyền thống tại TP. Hồ Chí Minh. Trường tọa lạc tại khu vực quận Phú Nhuận, với không gian rợp mát cây xanh, dãy lớp học khang trang và bề dày thành tích dạy tốt - học tốt. Trường được đặt theo tên của danh sĩ Hàn Thuyên (Nguyễn Thuyên) - người tiên phong ứng dụng chữ Nôm trong thi ca nước Việt thời Trần.`,
      places: [
        {
          title: "Trường THPT Hàn Thuyên",
          uri: "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+THPT+H%C3%A0n+Thuy%C3%AAn+Ph%C3%BA+Nhu%E1%BA%ADn+H%E1%BB%93+Ch%C3%AD+Minh",
          address: "Phường Phú Nhuận, TP. Hồ Chí Minh",
        }
      ],
      groundingChunks: []
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Bạn là hướng dẫn viên thực địa chuyên nghiệp giới thiệu về Trường Trung học Phổ thông Hàn Thuyên (THPT Hàn Thuyên) tại quận Phú Nhuận, TP. Hồ Chí Minh.
Câu hỏi của người tham quan: "${queryText}".
Hãy sử dụng công cụ Google Maps để tìm kiếm thông tin địa lý, địa chỉ, các địa điểm phụ cận nổi tiếng ở Phú Nhuận/kênh Nhiêu Lộc, lịch sử, hoạt động giáo dục và chia sẻ chân thực, sinh động, hữu ích bằng tiếng Việt.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: 10.7938,
              longitude: 106.6875, // Phu Nhuan, Ho Chi Minh City
            },
          },
        },
      },
    });

    const text = response.text || 'Không nhận được câu trả lời từ hệ thống thông tin thực địa.';
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const places: GroundingPlaceInfo[] = [];

    for (const chunk of rawChunks) {
      if ((chunk as any).maps) {
        const m = (chunk as any).maps;
        places.push({
          title: m.title || 'Địa điểm Google Maps',
          uri: m.uri || `https://maps.google.com/?q=${encodeURIComponent(m.title || 'THPT Han Thuyen')}`,
          address: m.placeAnswerSources?.addressSnippet,
          reviewSnippets: m.placeAnswerSources?.reviewSnippets,
        });
      }
    }

    if (places.length === 0) {
      places.push({
        title: "Trường THPT Hàn Thuyên",
        uri: "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+THPT+H%C3%A0n+Thuy%C3%AAn+TP+HCM",
        address: "Khu vực Phú Nhuận, Thành phố Hồ Chí Minh"
      });
    }

    return {
      text,
      places,
      groundingChunks: rawChunks,
    };
  } catch (error: any) {
    console.error('Error fetching Google Maps Grounding via Gemini 3.8 Flash:', error);
    return {
      text: `Thông tin từ trường THPT Hàn Thuyên (Phú Nhuận, TP.HCM): Trường mang tên danh nhân văn hóa Hàn Thuyên, nổi bật với phong trào học tập tích cực, các hoạt động Đoàn Đội, thể dục thể thao sôi nổi và môi trường học đường thân thiện. (Lỗi tra cứu: ${error?.message || 'Không thể kết nối máy chủ Google Maps'})`,
      places: [
        {
          title: "Trường THPT Hàn Thuyên trên Google Maps",
          uri: "https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+THPT+H%C3%A0n+Thuy%C3%AAn+TP+HCM",
          address: "Phú Nhuận, TP. Hồ Chí Minh",
        }
      ],
      groundingChunks: []
    };
  }
}
