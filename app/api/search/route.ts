import { NextRequest, NextResponse } from 'next/server';
import { books } from '@/data/mockData';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json({ found: false, books: [], message: '请提供搜索关键词' });
  }

  const lowerQuery = query.toLowerCase();

  const results = books.filter(book =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery)
  );

  const simplified = results.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    category: book.category,
  }));

  return NextResponse.json({
    found: results.length > 0,
    total: results.length,
    query,
    books: simplified,
  });
}
