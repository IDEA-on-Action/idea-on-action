#!/usr/bin/env node

/**
 * GitHub 이슈 생성 스크립트
 * .github/project_v2.0.yml 파일을 읽어서 GitHub 이슈들을 생성합니다.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// YAML 파일 경로
const yamlPath = path.join(__dirname, '..', '.github', 'project_v2.0.yml');

// 간단한 YAML 파서 (기본적인 구조만 파싱)
function parseYAML(content) {
  const issues = [];
  const lines = content.split('\n');
  let currentIssue = null;
  let inBody = false;
  let bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 이슈 시작
    if (line.trim().startsWith('- title:')) {
      // 이전 이슈 저장
      if (currentIssue) {
        if (bodyLines.length > 0) {
          currentIssue.body = bodyLines.join('\n').trim();
        }
        issues.push(currentIssue);
      }
      
      // 새 이슈 시작
      currentIssue = {
        title: line.split('title:')[1].trim().replace(/^["']|["']$/g, ''),
        body: '',
        labels: [],
        assignees: [],
        priority: '',
        sprint: '',
        status: ''
      };
      inBody = false;
      bodyLines = [];
      continue;
    }
    
    // Body 시작
    if (line.trim() === 'body: |' || line.trim().startsWith('body:')) {
      inBody = true;
      if (line.includes('"')) {
        // 한 줄 body
        currentIssue.body = line.split('body:')[1].trim().replace(/^["']|["']$/g, '');
        inBody = false;
      }
      continue;
    }
    
    // Body 내용
    if (inBody && currentIssue) {
      if (line.trim() === '' && bodyLines.length === 0) {
        continue; // 첫 빈 줄 스킵
      }
      if (line.match(/^\s{4,}/) || line.trim() === '') {
        bodyLines.push(line);
      } else {
        inBody = false;
        if (bodyLines.length > 0) {
          currentIssue.body = bodyLines.join('\n').trim();
          bodyLines = [];
        }
      }
    }
    
    // Labels
    if (line.trim().startsWith('labels:')) {
      const labelsMatch = line.match(/\[(.*?)\]/);
      if (labelsMatch) {
        currentIssue.labels = labelsMatch[1]
          .split(',')
          .map(l => l.trim().replace(/^["']|["']$/g, ''));
      }
      continue;
    }
    
    // Assignees
    if (line.trim().startsWith('assignees:')) {
      const assigneesMatch = line.match(/\[(.*?)\]/);
      if (assigneesMatch) {
        currentIssue.assignees = assigneesMatch[1]
          .split(',')
          .map(a => a.trim().replace(/^["']|["']$/g, ''));
      }
      continue;
    }
    
    // Priority
    if (line.trim().startsWith('priority:')) {
      currentIssue.priority = line.split('priority:')[1].trim().replace(/^["']|["']$/g, '');
      continue;
    }
    
    // Sprint
    if (line.trim().startsWith('sprint:')) {
      currentIssue.sprint = line.split('sprint:')[1].trim().replace(/^["']|["']$/g, '');
      continue;
    }
    
    // Status
    if (line.trim().startsWith('status:')) {
      currentIssue.status = line.split('status:')[1].trim().replace(/^["']|["']$/g, '');
      continue;
    }
  }
  
  // 마지막 이슈 저장
  if (currentIssue) {
    if (bodyLines.length > 0) {
      currentIssue.body = bodyLines.join('\n').trim();
    }
    issues.push(currentIssue);
  }
  
  return issues;
}

// GitHub 이슈 생성
function createIssue(issue) {
  try {
    // Body에 메타데이터 추가
    let fullBody = issue.body;
    if (issue.priority || issue.sprint || issue.status) {
      fullBody += '\n\n---\n';
      if (issue.priority) fullBody += `\n**Priority:** ${issue.priority}`;
      if (issue.sprint) fullBody += `\n**Sprint:** ${issue.sprint}`;
      if (issue.status) fullBody += `\n**Status:** ${issue.status}`;
    }
    
    // gh 명령어 구성
    // 라벨은 일단 제외 (나중에 수동으로 추가 가능)
    // const labelsArg = issue.labels.length > 0 
    //   ? issue.labels.map(l => `--label "${l}"`).join(' ')
    //   : '';
    
    const assigneesArg = issue.assignees.length > 0 && issue.assignees[0] !== ''
      ? `--assignee "${issue.assignees.join('","')}"` 
      : '';
    
    // Body를 임시 파일로 저장 (특수문자 처리)
    const tempFile = path.join(__dirname, '..', '.temp-issue-body.txt');
    fs.writeFileSync(tempFile, fullBody, 'utf8');
    
    // gh issue create 명령어 실행 (라벨 없이 생성)
    let command = `gh issue create --title "${issue.title}" --body-file "${tempFile}"`;
    if (assigneesArg) {
      command += ` ${assigneesArg}`;
    }
    
    console.log(`Creating issue: ${issue.title}`);
    const output = execSync(command, { encoding: 'utf8', cwd: path.join(__dirname, '..') });
    console.log(`✓ Created: ${output.trim()}`);
    
    // 라벨 추가 (존재하지 않는 라벨은 무시)
    if (issue.labels.length > 0) {
      const issueNumber = output.trim().match(/#(\d+)/)?.[1];
      if (issueNumber) {
        for (const label of issue.labels) {
          try {
            execSync(`gh issue edit ${issueNumber} --add-label "${label}"`, { 
              encoding: 'utf8', 
              cwd: path.join(__dirname, '..'),
              stdio: 'ignore'
            });
          } catch (e) {
            // 라벨이 없으면 무시
          }
        }
      }
    }
    
    // 임시 파일 삭제
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error(`✗ Failed to create issue "${issue.title}":`, error.message);
    // 임시 파일 정리
    const tempFile = path.join(__dirname, '..', '.temp-issue-body.txt');
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    return false;
  }
}

// 메인 실행
function main() {
  try {
    console.log('Reading YAML file...');
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    
    console.log('Parsing YAML...');
    const issues = parseYAML(yamlContent);
    
    console.log(`Found ${issues.length} issues to create.\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const issue of issues) {
      if (createIssue(issue)) {
        successCount++;
      } else {
        failCount++;
      }
      console.log(''); // 빈 줄
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total: ${issues.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

