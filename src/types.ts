/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortfolioItem {
  id: number;
  title: string;
  category: string; // "1", "2", "3" (matching search codes: 1=House Plant, 2=Flowers, 3=Photography)
  categoryName: string; // Display category string (e.g., "Graphic Design", "Nature Plant", etc.)
  subtitle: string;
  image: string;
}

export interface TimelineItem {
  title: string;
  subTitle: string; // e.g., "Graphic Designer (2017 - 2019)"
}

export interface SkillItem {
  name: string;
  value: number; // percentage (e.g., 85)
}
