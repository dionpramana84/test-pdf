import { NextResponse } from 'next/server'
import PuppeteerHTMLPDF from 'puppeteer-html-pdf'
import hbs from 'handlebars'
import path from 'path'
import fs from 'fs'
import dayjs from 'dayjs'

export async function POST(req: Request) {
  const {
    mode,
    template_name,
    payload,
  }: { mode: 'DOWNLOAD' | 'VIEW'; template_name: string; payload: any } =
    await req.json()

  const filePath = path.resolve('./public/templates', `${template_name}.html`)

  if (mode !== 'DOWNLOAD' && mode !== 'VIEW') {
    return NextResponse.json(
      { details: 'Invalid mode!', error_code: 'BAD_REQUEST', code: 400 },
      { status: 400 },
    )
  }

  const checkFile = fs.existsSync(filePath)
  if (!checkFile) {
    return NextResponse.json(
      {
        details: 'Template name not found!',
        error_code: 'NOT_FOUND',
        code: 404,
      },
      { status: 404 },
    )
  }

  try {
    const dataParse = {
      ...payload,
      general: {
        current_date: dayjs().format('DD MMMM YYYY'),
        template_id: `${template_name
          .split('-')
          .map((item) => item[0])
          .join('')
          .toUpperCase()}-${dayjs().format('DDMMYYYY')}`,
      },
    }

    const htmlPDF = new PuppeteerHTMLPDF()
    htmlPDF.setOptions({ format: 'A4' })

    const html = await htmlPDF.readFile(filePath, 'utf8')
    const template = hbs.compile(html)
    const content = template(dataParse)
    const pdfBuffer = await htmlPDF.create(content)

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')

    if (mode === 'DOWNLOAD') {
      headers.set('Content-Disposition', 'inline; filename="myfile.pdf"')
    } else {
      headers.set('Content-Disposition', 'attachment; filename="filename.pdf"')
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      statusText: 'OK',
      headers,
    })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
