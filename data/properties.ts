/**
 * Mock data — kept for local development/testing only.
 * In production, data is fetched from Supabase via lib/supabase/queries.ts.
 */
import { Property } from '@/types/property';

function makeProperty(
  id: string,
  title: string,
  location: string,
  price: number,
  beds: number,
  baths: number,
  area: number,
  imageUrl: string,
  type: Property['type'],
  purpose: Property['purpose'],
  isFeatured: boolean,
  tag?: string,
): Property {
  return {
    id,
    title,
    location,
    price,
    beds,
    baths,
    area,
    tag,
    type,
    purpose,
    isFeatured,
    status: 'active',
    images: [
      {
        id: `${id}-img-0`,
        propertyId: id,
        url: imageUrl,
        sortOrder: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const mockProperties: Property[] = [
  makeProperty('prop-1', 'The Glass Pavilion', 'Beverly Hills, California', 5250000, 5, 4.5, 4200, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM', 'villa', 'buy', true, 'Exclusive'),
  makeProperty('prop-2', 'Azure Heights Penthouse', 'Downtown, Vancouver', 3800000, 3, 3, 2100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s', 'penthouse', 'buy', true, 'New Arrival'),
  makeProperty('prop-3', 'Modern Family Home', '123 Pine St, Seattle', 850000, 3, 2, 120, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E', 'house', 'buy', false),
  makeProperty('prop-4', 'Urban Loft', '456 Elm Ave, Portland', 3200, 1, 1, 85, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4', 'apartment', 'rent', false),
  makeProperty('prop-5', 'Highland Retreat', '789 Mountain Rd, Bend', 620000, 2, 2, 98, 'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro', 'house', 'buy', false),
  makeProperty('prop-6', 'Sea View Penthouse', '321 Ocean Dr, Miami', 4500, 3, 3, 180, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U', 'penthouse', 'rent', false),
  makeProperty('prop-7', 'Central Studio', '555 Main St, Chicago', 550000, 1, 1, 50, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE', 'apartment', 'buy', false),
  makeProperty('prop-8', 'Garden Villa', '999 Oak Ln, Austin', 2800, 2, 2, 110, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8', 'villa', 'rent', false),
  makeProperty('prop-9', 'The Obsidian Villa', 'Aspen, Colorado', 4200000, 4, 4.5, 325, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', 'villa', 'buy', true, 'Exclusive'),
  makeProperty('prop-10', 'Luminary Heights Penthouse', 'Chelsea, New York', 7500, 2, 2, 140, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'penthouse', 'rent', true, 'New Arrival'),
  makeProperty('prop-11', 'Nordic Breeze Cabin', 'Stowe, Vermont', 980000, 3, 2.5, 180, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', 'house', 'buy', false),
  makeProperty('prop-12', 'Industrial Loft Studio', 'Brooklyn, New York', 2900, 1, 1, 75, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', 'apartment', 'rent', false),
  makeProperty('prop-13', 'Elysian Estate', 'Santa Barbara, California', 6800000, 6, 7, 580, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 'villa', 'buy', false, 'Exclusive'),
  makeProperty('prop-14', 'Glass Pavilion West', 'Malibu, California', 8500, 3, 3, 260, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', 'villa', 'rent', false),
  makeProperty('prop-15', 'Sleek Urban Condo', 'San Francisco, California', 1250000, 2, 2, 110, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', 'apartment', 'buy', false),
  makeProperty('prop-16', 'Vista del Mar Penthouse', 'San Diego, California', 2950000, 3, 3.5, 220, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'penthouse', 'buy', false, 'Hot Deal'),
  makeProperty('prop-17', 'Modernist Forest House', 'Portland, Oregon', 1450000, 4, 3, 280, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', 'house', 'buy', false),
  makeProperty('prop-18', 'Metropolitan Horizon Flat', 'Downtown Seattle, Washington', 3400, 2, 2, 95, 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=800&q=80', 'apartment', 'rent', false),
  makeProperty('prop-19', 'The Azure Horizon', 'Malibu, California', 7200000, 5, 6, 620, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', 'villa', 'buy', true, 'Exclusive'),
  makeProperty('prop-20', 'Urban Oasis Loft', 'SoHo, New York', 6200, 2, 2, 115, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', 'apartment', 'rent', true, 'New Arrival'),
  makeProperty('prop-21', 'The Sunset Pavilion', 'Phoenix, Arizona', 1650000, 4, 3.5, 340, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80', 'house', 'buy', false),
  makeProperty('prop-22', 'Skyline Terrace Penthouse', 'Downtown Seattle, Washington', 4100000, 3, 3, 250, 'https://images.unsplash.com/photo-1512917774-827c1f0af274?auto=format&fit=crop&w=800&q=80', 'penthouse', 'buy', false, 'Hot Deal'),
  makeProperty('prop-23', 'Serene Woodside Cottage', 'Lake Tahoe, California', 1850000, 3, 2.5, 210, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', 'house', 'buy', false),
  makeProperty('prop-24', 'Emerald Creek Villa', 'Boulder, Colorado', 3100000, 4, 4, 410, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80', 'villa', 'buy', false),
  makeProperty('prop-25', 'Highrise Studio', 'Miami Beach, Florida', 3100, 1, 1, 68, 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80', 'apartment', 'rent', false),
  makeProperty('prop-26', 'Modern Suburbia Family House', 'Austin, Texas', 790000, 4, 3, 230, 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80', 'house', 'buy', false),
  makeProperty('prop-27', 'The Chic Loft', 'Portland, Oregon', 2600, 1, 1.5, 85, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80', 'apartment', 'rent', false),
  makeProperty('prop-28', 'Hillside Mansion', 'Los Angeles, California', 8900000, 6, 7.5, 720, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', 'villa', 'buy', false, 'Exclusive'),
];
